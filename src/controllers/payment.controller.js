import asyncHandler from "express-async-handler";
import { success } from "../utils/response.js";
import { createVnpayPaymentUrl, handleVnpayIpn } from "../services/payment.service.js";
import { createSecureHash, sortObject } from "../utils/vnpay.js";
import qs from "qs";

export const createPaymentUrl = asyncHandler(async (req, res) => {
  const { orderId } = req.body;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const paymentUrl = await createVnpayPaymentUrl(orderId, ip);
  success(res, { paymentUrl });
});

export const vnpReturn = asyncHandler(async (req, res) => {
  let vnp_Params = { ...req.query };

  const secureHash = vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  vnp_Params = sortObject(vnp_Params);

  const signData = qs.stringify(vnp_Params, { encode: true });
  const signed = createSecureHash(signData, process.env.VNP_HASH_SECRET);

  if (secureHash === signed) {
    res.json({
      status: "success",
      message: "Payment return verified",
      data: vnp_Params
    });
  } else {
    res.json({
      status: "error",
      message: "Invalid signature",
      data: vnp_Params
    });
  }
});

export const vnpIpn = asyncHandler(async (req, res) => {
  let vnp_Params = { ...req.query };

  const secureHash = vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  vnp_Params = sortObject(vnp_Params);

  const signData = qs.stringify(vnp_Params, { encode: true });
  const signed = createSecureHash(signData, process.env.VNP_HASH_SECRET);

  if (secureHash !== signed) {
    return res.json({ RspCode: "97", Message: "Invalid signature" });
  }

  const result = await handleVnpayIpn(vnp_Params);

  return res.json(result);
});
