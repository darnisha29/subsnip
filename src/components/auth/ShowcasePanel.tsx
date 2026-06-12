import { CountUp } from "@/components/common/CountUp";
import { Typography } from "@/components/common/Typography";
import { Card, CardContent } from "@/components/ui/card";
import { signUpShowcase } from "@/data/auth";

const { preview } = signUpShowcase;

// "Shock moment" mockup: hidden yearly spend (animated count-up) above the
// top detected subscriptions. Static data from data/auth.
export const ShowcasePanel = () => {
  return (
    <Card className="gap-0 py-0 shadow-[0_16px_50px_rgba(83,74,183,0.1)] ring-border">
      <CardContent className="flex flex-col gap-3 p-5 sm:p-6">
        <div className="flex flex-col gap-1">
          <Typography
            as="span"
            variant="caption"
            className="font-semibold tracking-wider text-pill-foreground uppercase"
          >
            {preview.spendLabel}
          </Typography>
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <CountUp
              value={preview.spendAmount}
              prefix="₹"
              className="text-4xl font-bold tracking-tight text-primary tabular-nums sm:text-5xl"
            />
            <Typography as="span" variant="caption" className="text-tertiary">
              {preview.spendMeta}
            </Typography>
          </div>
        </div>

        <ul className="flex flex-col border-t border-border">
          {preview.subscriptions.map((subscription) => (
            <li
              key={subscription.name}
              className="flex items-center justify-between gap-3 border-b border-border py-3 last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <Typography
                  as="span"
                  variant="caption"
                  aria-hidden="true"
                  className="flex size-7 items-center justify-center rounded-md bg-secondary font-semibold text-secondary-foreground"
                >
                  {subscription.name.charAt(0)}
                </Typography>
                <Typography as="span" variant="body" className="font-medium">
                  {subscription.name}
                </Typography>
              </div>
              <Typography
                as="span"
                variant="small"
                className="font-medium whitespace-nowrap text-foreground"
              >
                {subscription.amount}
              </Typography>
            </li>
          ))}
        </ul>

        <Typography
          variant="small"
          className="text-center font-medium text-primary"
        >
          {preview.moreLabel}
        </Typography>
      </CardContent>
    </Card>
  );
};
