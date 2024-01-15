import crypto from "crypto";

const SECRET = "MADUKOMA-BLESSED-SECRET-KEY";

export const random = () => crypto.randomBytes(128).toString("base64");

export const hash = (salt: string, password: string) => {
  return crypto
    .createHmac("sha256", [salt, password].join("/"))
    .update(SECRET)
    .digest("hex");
};
