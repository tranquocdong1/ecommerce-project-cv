import { response } from "express";
import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    name: String,
    price: Number,
    quantity: Number,
    subtotal: Number
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    items: [OrderItemSchema],

    totalItems: {
      type: Number,
      required: true
    },

    totalPrice: {
      type: Number,
      required: true
    },

    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "completed", "cancelled"],
      default: "pending"
    },

    paymentMethod: {
      type: String,
      enum: ["cod", "vnpay", "momo"],
      default: "cod"
    },

    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "refund"],
      default: "unpaid"
    },

    shippingAddress: {
      fullName: String,
      phone: String,
      address: String
    },

    paymentInfo: {
      provider: String,
      transactionNo: String,
      bankCode: String,
      responseCode: String,
      rawData: Object
    }
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);
export default Order;
