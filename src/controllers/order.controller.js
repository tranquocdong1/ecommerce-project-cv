import asyncHandler from "express-async-handler";
import {
  createOrderFromCart,
  getMyOrders,
  getOrderById,
  updateOrderStatus
} from "../services/order.service.js";
import { success } from "../utils/response.js";

export const createOrder = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { paymentMethod, shippingAddress } = req.body;

  const order = await createOrderFromCart(userId, {
    paymentMethod,
    shippingAddress
  });

  success(res, { order }, 201);
});

export const getMyOrderList = asyncHandler(async (req, res) => {
  const orders = await getMyOrders(req.user.userId);
  success(res, { orders });
});

export const getMyOrderDetail = asyncHandler(async (req, res) => {
  const order = await getOrderById(req.params.id, req.user.userId, false);
  success(res, { order });
});

export const adminGetOrderDetail = asyncHandler(async (req, res) => {
  const order = await getOrderById(req.params.id, null, true);
  success(res, { order });
});

export const adminUpdateOrderStatus = asyncHandler(async (req, res) => {
  const { status, paymentStatus } = req.body;
  const order = await updateOrderStatus(req.params.id, status, paymentStatus);
  success(res, { order });
});
