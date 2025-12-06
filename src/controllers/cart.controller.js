import asyncHandler from "express-async-handler";
import {
  getCart,
  addToCart,
  updateQuantity,
  removeItem,
  clearCart
} from "../services/cart.service.js";
import { success } from "../utils/response.js";

export const getMyCart = asyncHandler(async (req, res) => {
  const cart = await getCart(req.user.userId);
  success(res, { cart });
});

export const add = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const cart = await addToCart(req.user.userId, productId, quantity);
  success(res, { cart });
});

export const update = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const cart = await updateQuantity(req.user.userId, productId, quantity);
  success(res, { cart });
});

export const remove = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const cart = await removeItem(req.user.userId, productId);
  success(res, { cart });
});

export const clear = asyncHandler(async (req, res) => {
  const cart = await clearCart(req.user.userId);
  success(res, { cart });
});
