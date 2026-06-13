import type { Database } from "@/types/supabase";

type Service = Database["public"]["Tables"]["services"]["Row"];
type BillingCycle = Database["public"]["Enums"]["billing_cycle"];

export interface FoundSubscription {
  // Stable React key + dedup key: `svc:<id>` for catalog, `man:<normKey>` for
  // manual (uncatalogued) finds.
  key: string;
  serviceId: string | null;
  manualName: string | null;
  displayName: string;
  amountInr: number;
  billingCycle: BillingCycle;
  confidence: number;
  firstChargeDate: string;
  lastChargeDate: string;
}

export interface ScanResult {
  found: FoundSubscription[];
  processed: number;
  total: number;
  errorCount: number;
}

interface RunGmailScanOptions {
  accessToken: string;
  services: Service[];
  existingServiceIds: ReadonlySet<string>;
  existingManualKeys: ReadonlySet<string>;
  onProgress: (
    processed: number,
    total: number,
    found: FoundSubscription[],
  ) => void;
}

interface MessageMeta {
  from: string;
  subject: string;
  snippet: string;
  internalDate: number;
}

const GMAIL_API = "https://gmail.googleapis.com/gmail/v1/users/me";
// 6-month window of purchase-like emails; metadata only, bodies never fetched.
const SCAN_QUERY =
  "newer_than:180d (category:purchases OR subject:(receipt OR invoice OR payment OR renewal OR subscription))";
const MAX_MESSAGES = 300;
const CONCURRENCY = 8;
const AMOUNT_PATTERN = /(?:₹|Rs\.?\s?|INR\s?)\s*([\d,]+(?:\.\d{1,2})?)/i;
// Words that make an email read as a charge rather than marketing.
const TRANSACTIONAL_PATTERN =
  /payment|receipt|invoice|renew|charged|debited|membership|subscription|paid|order|billing/i;
// Stricter gate for UNCATALOGUED senders: must clearly be a recurring
// subscription, not a one-time purchase (no curated regex to trust here).
const STRONG_SUBSCRIPTION_PATTERN =
  /subscription|subscribe|renew|auto[- ]?renew|recurring|membership|your plan|billing cycle|next billing|monthly plan|annual plan/i;
// Senders that are intermediaries or marketplaces — an email FROM them is
// never a subscription with them (a bank debit isn't an "HDFC subscription").
const INTERMEDIARY_DOMAINS = [
  "hdfcbank",
  "icici",
  "sbi",
  "axisbank",
  "kotak",
  "yesbank",
  "paytm",
  "phonepe",
  "razorpay",
  "payu",
  "billdesk",
  "cashfree",
  "amazon",
  "flipkart",
  "myntra",
  "makemytrip",
  "goibibo",
  "irctc",
  "uber",
  "ola",
  "rapido",
  "gmail",
  "outlook",
  "yahoo",
  "hotmail",
  "googlemail",
];
// Sender tokens that carry no brand meaning — stripped when deriving a name.
const GENERIC_NAME_TOKENS = new Set([
  "no-reply",
  "noreply",
  "donotreply",
  "do-not-reply",
  "team",
  "billing",
  "support",
  "info",
  "hello",
  "notifications",
  "notification",
  "account",
  "accounts",
  "mailer",
  "via",
  "mail",
  "email",
  "send",
  "news",
  "updates",
]);
const GENERIC_SUBDOMAINS = new Set([
  "no-reply",
  "noreply",
  "mail",
  "email",
  "billing",
  "notifications",
  "send",
  "mailer",
  "e",
  "t",
  "em",
  "news",
  "info",
]);

const gmailFetch = async <T>(
  accessToken: string,
  path: string,
): Promise<T | null> => {
  const response = await fetch(`${GMAIL_API}${path}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) {
    return null;
  }
  return (await response.json()) as T;
};

const listMessageIds = async (accessToken: string): Promise<string[]> => {
  const ids: string[] = [];
  let pageToken: string | undefined;
  while (ids.length < MAX_MESSAGES) {
    const params = new URLSearchParams({
      q: SCAN_QUERY,
      maxResults: "100",
      ...(pageToken ? { pageToken } : {}),
    });
    const page = await gmailFetch<{
      messages?: Array<{ id: string }>;
      nextPageToken?: string;
    }>(accessToken, `/messages?${params.toString()}`);
    if (!page?.messages?.length) {
      break;
    }
    ids.push(...page.messages.map((message) => message.id));
    if (!page.nextPageToken) {
      break;
    }
    pageToken = page.nextPageToken;
  }
  return ids.slice(0, MAX_MESSAGES);
};

const fetchMessageMeta = async (
  accessToken: string,
  id: string,
): Promise<MessageMeta | null> => {
  const message = await gmailFetch<{
    snippet?: string;
    internalDate?: string;
    payload?: { headers?: Array<{ name: string; value: string }> };
  }>(
    accessToken,
    `/messages/${id}?format=metadata&metadataHeaders=From&metadataHeaders=Subject`,
  );
  if (!message) {
    return null;
  }
  const headers = message.payload?.headers ?? [];
  const header = (name: string) =>
    headers.find((entry) => entry.name.toLowerCase() === name)?.value ?? "";
  return {
    from: header("from"),
    subject: header("subject"),
    snippet: message.snippet ?? "",
    internalDate: Number(message.internalDate ?? 0),
  };
};

const compileServices = (services: Service[]) =>
  services.map((service) => {
    const patterns = Array.isArray(service.regex_patterns)
      ? (service.regex_patterns as string[])
      : [];
    const regexes = patterns
      .map((pattern) => {
        try {
          return new RegExp(pattern, "i");
        } catch {
          return null;
        }
      })
      .filter((regex): regex is RegExp => regex !== null);
    return { service, regexes };
  });

const inferCycle = (text: string, service?: Service): BillingCycle => {
  if (/annual|yearly|per year|\/\s?yr/i.test(text)) {
    return "annual";
  }
  if (/quarter/i.test(text)) {
    return "quarterly";
  }
  return service?.default_billing_cycle ?? "monthly";
};

const extractAmountInr = (
  text: string,
  service?: Service,
): { amount: number; extracted: boolean } | null => {
  const match = AMOUNT_PATTERN.exec(text);
  if (match) {
    const amount = Number.parseFloat(match[1].replaceAll(",", ""));
    if (Number.isFinite(amount) && amount >= 10 && amount <= 200000) {
      return { amount, extracted: true };
    }
  }
  // Catalog services have a default price tier; manual finds do not.
  const fallback = service?.default_amounts_inr?.[0];
  if (fallback) {
    return { amount: fallback, extracted: false };
  }
  return null;
};

// Dedup/identity key shared between scan-time derivation and existing rows.
export const normalizeKey = (value: string | null): string =>
  (value ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");

interface ParsedFrom {
  displayName: string;
  domainLabel: string;
}

const parseFromHeader = (from: string): ParsedFrom => {
  const nameMatch = /^\s*"?([^"<]*?)"?\s*</.exec(from);
  const displayName = nameMatch ? nameMatch[1].trim() : "";
  const emailMatch = /<([^>]+)>/.exec(from) ?? /([^\s<]+@[^\s>]+)/.exec(from);
  const host = emailMatch ? (emailMatch[1].split("@")[1] ?? "") : "";
  const parts = host.toLowerCase().split(".").filter(Boolean);
  // Drop generic subdomains, then take the registrable (second-level) label.
  const meaningful = parts.filter((part) => !GENERIC_SUBDOMAINS.has(part));
  const domainLabel =
    meaningful.length >= 2
      ? meaningful[meaningful.length - 2]
      : (parts[0] ?? "");
  return { displayName, domainLabel };
};

const titleCase = (value: string): string =>
  value
    .split(/[\s._-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

// Best-effort brand name from a From header: prefer a meaningful display name,
// else the registrable domain label. Returns null when nothing usable remains.
const deriveManualName = (from: string): string | null => {
  const { displayName, domainLabel } = parseFromHeader(from);
  const cleanedDisplay = displayName
    .split(/[\s]+/)
    .filter((token) => !GENERIC_NAME_TOKENS.has(token.toLowerCase()))
    .join(" ")
    .trim();
  const candidate =
    cleanedDisplay.length >= 2 && !cleanedDisplay.includes("@")
      ? cleanedDisplay
      : domainLabel.length >= 2
        ? titleCase(domainLabel)
        : "";
  if (!candidate) {
    return null;
  }
  return candidate.slice(0, 200);
};

const domainIsIntermediary = (from: string): boolean => {
  const { domainLabel } = parseFromHeader(from);
  return INTERMEDIARY_DOMAINS.some((entry) => domainLabel.includes(entry));
};

const toDateString = (ms: number): string =>
  new Date(ms).toISOString().slice(0, 10);

export const runGmailScan = async ({
  accessToken,
  services,
  existingServiceIds,
  existingManualKeys,
  onProgress,
}: RunGmailScanOptions): Promise<ScanResult> => {
  const compiled = compileServices(services).filter(
    ({ service }) => !existingServiceIds.has(service.id),
  );
  const ids = await listMessageIds(accessToken);
  const total = ids.length;
  const found = new Map<string, FoundSubscription>();
  let processed = 0;
  let errorCount = 0;

  // Insert or merge a find by its stable key (latest charge wins for amount).
  const record = (
    base: Omit<FoundSubscription, "firstChargeDate" | "lastChargeDate">,
    chargeDate: string,
    amountExtracted: boolean,
  ) => {
    const existing = found.get(base.key);
    if (!existing) {
      found.set(base.key, {
        ...base,
        firstChargeDate: chargeDate,
        lastChargeDate: chargeDate,
      });
      return;
    }
    if (chargeDate < existing.firstChargeDate) {
      existing.firstChargeDate = chargeDate;
    }
    if (chargeDate >= existing.lastChargeDate) {
      existing.lastChargeDate = chargeDate;
      if (amountExtracted) {
        existing.amountInr = base.amountInr;
      }
    }
    existing.confidence = Math.max(existing.confidence, base.confidence);
  };

  for (let start = 0; start < ids.length; start += CONCURRENCY) {
    const batch = ids.slice(start, start + CONCURRENCY);
    const metas = await Promise.all(
      batch.map((id) => fetchMessageMeta(accessToken, id)),
    );

    for (const meta of metas) {
      processed += 1;
      if (!meta) {
        errorCount += 1;
        continue;
      }
      const haystack = `${meta.subject} ${meta.snippet}`;
      const chargeDate = toDateString(meta.internalDate);

      // 1) Catalog match — the email must come FROM the service itself.
      // Keywords in subject/snippet alone are too noisy (bank statements
      // and telecom promos mention services the user never subscribed to).
      let matchedCatalog = false;
      for (const { service, regexes } of compiled) {
        const senderHit = regexes.some((regex) => regex.test(meta.from));
        if (!senderHit) {
          continue;
        }
        // And it must read like a charge, not marketing from that service.
        const amount = extractAmountInr(haystack, service);
        const isTransactional = TRANSACTIONAL_PATTERN.test(haystack);
        if (!amount || (!amount.extracted && !isTransactional)) {
          continue;
        }
        record(
          {
            key: `svc:${service.id}`,
            serviceId: service.id,
            manualName: null,
            displayName: service.name,
            amountInr: amount.amount,
            billingCycle: inferCycle(haystack, service),
            confidence: amount.extracted ? 0.9 : 0.75,
          },
          chargeDate,
          amount.extracted,
        );
        matchedCatalog = true;
        break;
      }
      if (matchedCatalog) {
        continue;
      }

      // 2) Manual capture for uncatalogued senders — stricter gate: a real
      // ₹ amount AND explicit subscription wording AND not an intermediary
      // (bank/wallet/marketplace), so one-time purchases don't slip through.
      const amount = extractAmountInr(haystack);
      if (
        !amount?.extracted ||
        !STRONG_SUBSCRIPTION_PATTERN.test(haystack) ||
        domainIsIntermediary(meta.from)
      ) {
        continue;
      }
      const name = deriveManualName(meta.from);
      if (!name) {
        continue;
      }
      const normKey = normalizeKey(name);
      if (existingManualKeys.has(normKey)) {
        continue;
      }
      record(
        {
          key: `man:${normKey}`,
          serviceId: null,
          manualName: name,
          displayName: name,
          amountInr: amount.amount,
          billingCycle: inferCycle(haystack),
          confidence: 0.5,
        },
        chargeDate,
        true,
      );
    }
    onProgress(processed, total, [...found.values()]);
  }

  return {
    found: [...found.values()],
    processed,
    total,
    errorCount,
  };
};

const CYCLE_MONTHS: Record<BillingCycle, number> = {
  weekly: 0,
  monthly: 1,
  quarterly: 3,
  semi_annual: 6,
  annual: 12,
  lifetime: 0,
  unknown: 1,
};

export const nextRenewalDate = (
  lastChargeDate: string,
  cycle: BillingCycle,
): string | null => {
  if (cycle === "lifetime") {
    return null;
  }
  const date = new Date(`${lastChargeDate}T00:00:00Z`);
  if (cycle === "weekly") {
    date.setUTCDate(date.getUTCDate() + 7);
  } else {
    date.setUTCMonth(date.getUTCMonth() + CYCLE_MONTHS[cycle]);
  }
  // Roll forward so the renewal is always in the future.
  const today = new Date().toISOString().slice(0, 10);
  while (date.toISOString().slice(0, 10) < today) {
    if (cycle === "weekly") {
      date.setUTCDate(date.getUTCDate() + 7);
    } else {
      date.setUTCMonth(date.getUTCMonth() + CYCLE_MONTHS[cycle]);
    }
  }
  return date.toISOString().slice(0, 10);
};
