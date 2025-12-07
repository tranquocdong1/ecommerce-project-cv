import qs from "qs";
import crypto from "crypto";

export const sortObject = (obj) => {
  const sorted = {};
  const keys = Object.keys(obj).sort();
  keys.forEach((key) => {
    sorted[key] = obj[key];
  });
  return sorted;
};

export const createSecureHash = (data, secret) => {
  const hmac = crypto.createHmac("sha512", secret);
  return hmac.update(Buffer.from(data, "utf-8")).digest("hex");
};
