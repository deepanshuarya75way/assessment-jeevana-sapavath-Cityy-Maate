import crypto from "crypto";

const key = () => Buffer.from(process.env.ENCRYPTION_KEY!, "hex");

export const encryptData = (data: any) => {
  const iv = crypto.randomBytes(12);
  const c = crypto.createCipheriv("aes-256-gcm", key(), iv);
  const e = c.update(JSON.stringify(data), "utf8", "base64") + c.final("base64");
  return `${iv.toString("base64")}.${c.getAuthTag().toString("base64")}.${e}`;
};

export const decryptData = (data: string) => {
  const [iv, tag, e] = data.split(".");
  const d = crypto.createDecipheriv("aes-256-gcm", key(), Buffer.from(iv, "base64"));
  d.setAuthTag(Buffer.from(tag, "base64"));
  return JSON.parse(d.update(e, "base64", "utf8") + d.final("utf8"));
};