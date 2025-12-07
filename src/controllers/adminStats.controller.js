import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { success } from "../utils/response.js";
import mongoose from "mongoose";
import moment from "moment";

export const getOverviewStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalOrders = await Order.countDocuments();
  const totalRevenue = await Order.aggregate([
    { $match: { paymentStatus: "paid" } },
    { $group: { _id: null, revenue: { $sum: "$totalPrice" } } },
  ]);

  success(res, {
    totalUsers,
    totalOrders,
    totalRevenue: totalRevenue[0]?.revenue || 0,
  });
});

export const getMonthlyRevenue = asyncHandler(async (req, res) => {
  const result = await Order.aggregate([
    { $match: { paymentStatus: "paid" } },
    {
      $group: {
        _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
        totalRevenue: { $sum: "$totalPrice" },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  success(res, result);
});

export const getDailyRevenue = asyncHandler(async (req, res) => {
  const sevenDaysAgo = moment().subtract(7, "days").toDate();

  const result = await Order.aggregate([
    {
      $match: {
        paymentStatus: "paid",
        createdAt: { $gte: sevenDaysAgo },
      },
    },
    {
      $group: {
        _id: {
          day: { $dayOfMonth: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        totalRevenue: { $sum: "$totalPrice" },
      },
    },
    { $sort: { "_id.month": 1, "_id.day": 1 } },
  ]);

  success(res, result);
});

export const getOrderStatusStats = asyncHandler(async (req, res) => {
  const result = await Order.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);
  success(res, result);
});

export const getBestSellingProducts = asyncHandler(async (req, res) => {
  const result = await Order.aggregate([
    { $match: { paymentStatus: "paid" } },

    { $unwind: "$items" },

    {
      $group: {
        _id: "$items.product",
        totalSold: { $sum: "$items.quantity" },
      },
    },

    { $sort: { totalSold: -1 } },
    { $limit: 10 },

    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "product",
      },
    },

    { $unwind: "$product" },
  ]);

  success(res, result);
});
