// * Node
import crypto from "crypto";

export default function CreateHash(password: string) {
  const secretKey = "0per@t!0nL!nd@b0x!@#_DealerPortal";
  const passkey = Buffer.from(password, "base64").toString();
  const salt = crypto
    .createHash("sha512")
    .update("www.safaricom.co.ke/secret")
    .digest("hex");
  const stringToHash = salt + passkey + secretKey;
  return crypto.createHash("sha512").update(stringToHash).digest("hex");
}
