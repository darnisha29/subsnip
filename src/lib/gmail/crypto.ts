import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

// AES-256-GCM for OAuth tokens at rest (the gmail_tokens table stores only
// ciphertext). Server-only: the key never reaches the client bundle.
const getKey = (): Buffer => {
  const key = Buffer.from(process.env.GMAIL_TOKEN_ENC_KEY ?? "", "base64");
  if (key.length !== 32) {
    throw new Error("GMAIL_TOKEN_ENC_KEY must be 32 bytes of base64");
  }
  return key;
};

export const encryptToken = (plaintext: string): string => {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", getKey(), iv);
  const ciphertext = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();
  return [
    iv.toString("base64"),
    authTag.toString("base64"),
    ciphertext.toString("base64"),
  ].join(".");
};

export const decryptToken = (payload: string): string => {
  const [iv, authTag, ciphertext] = payload
    .split(".")
    .map((part) => Buffer.from(part, "base64"));
  const decipher = createDecipheriv("aes-256-gcm", getKey(), iv);
  decipher.setAuthTag(authTag);
  return Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]).toString("utf8");
};
