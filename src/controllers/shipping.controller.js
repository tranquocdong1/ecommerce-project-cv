import asyncHandler from "express-async-handler";
import { confirmDelivery } from "../services/shipping.service.js";
import { success } from "../utils/response.js";

export const markDelivered = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const order = await confirmDelivery(id);

  success(res, {
    message: "Delivery confirmed",
    order
  });
});
