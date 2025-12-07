import qs from "qs";
import moment from "moment";
import { sortObject, createSecureHash } from "../utils/vnpay.js";
import Order from "../models/Order.js";

export const createVnpayPaymentUrl = async (orderId, ipAddress) => {
  const order = await Order.findById(orderId);
  if (!order) throw new Error("Order not found");

  const vnp_TmnCode = process.env.VNP_TMN_CODE;
  const vnp_HashSecret = process.env.VNP_HASH_SECRET;
  const vnp_Url = process.env.VNP_URL;
  const returnUrl = process.env.VNP_RETURN_URL;
  const vnp_IpnUrl = process.env.VNP_IPN_URL;

  const amount = order.totalPrice * 100;

  const createDate = moment().format("YYYYMMDDHHmmss");

  let params = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode,
    vnp_Amount: amount,
    vnp_CreateDate: createDate,
    vnp_CurrCode: "VND",
    vnp_IpAddr: ipAddress,
    vnp_Locale: "vn",
    vnp_OrderInfo: `Thanhtoandonhang${orderId}`,
    vnp_OrderType: "other",
    vnp_ReturnUrl: returnUrl,
    vnp_TxnRef: orderId.toString(),
  };

  params = sortObject(params);

  const signData = qs.stringify(params, { encode: true });
  const secureHash = createSecureHash(signData, vnp_HashSecret);

  params.vnp_SecureHash = secureHash;

  const paymentUrl = `${vnp_Url}?${qs.stringify(params, { encode: true })}`;

  return paymentUrl;
};

export const handleVnpayIpn = async (vnp_Params) => {
  const orderId = vnp_Params["vnp_TxnRef"];
  const responseCode = vnp_Params["vnp_ResponseCode"];
  const amount = Number(vnp_Params["vnp_Amount"]);
  const transactionNo = vnp_Params["vnp_TransactionNo"];
  const bankCode = vnp_Params["vnp_BankCode"];

  const order = await Order.findById(orderId);
  if (!order) {
    return { RspCode: "01", Message: "Order not found" };
  }

  if (order.paymentStatus === "paid") {
    return { RspCode: "02", Message: "Order already confirmed" };
  }

  const expectedAmount = order.totalPrice * 100;
  if (amount !== expectedAmount) {
    return { RspCode: "04", Message: "Invalid amount" };
  }

  order.paymentInfo = {
    provider: "vnpay",
    transactionNo,
    bankCode,
    responseCode,
    rawData: vnp_Params
  };

  if (responseCode === "00") {
    order.paymentStatus = "paid";
    order.status = "paid";
  } else {
    order.paymentStatus = "unpaid";
    order.status = "pending";
  }

  await order.save();

  return { RspCode: "00", Message: "Success" };
};