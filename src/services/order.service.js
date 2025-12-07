import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

export const createOrderFromCart = async (userId, { paymentMethod, shippingAddress }) => {
  const cart = await Cart.findOne({ user: userId }).populate("items.product");
  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  const items = cart.items.map((item) => {
    const price = item.product.finalPrice || item.product.price;
    const subtotal = price * item.quantity;
    return {
      product: item.product._id,
      name: item.product.name,
      price,
      quantity: item.quantity,
      subtotal
    };
  });

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.subtotal, 0);

  const order = await Order.create({
    user: userId,
    items,
    totalItems,
    totalPrice,
    paymentMethod: paymentMethod || "cod",
    shippingAddress
  });

  cart.items = [];
  await cart.save();

  return order;
};

export const getMyOrders = async (userId) => {
  const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
  return orders;
};

export const getOrderById = async (orderId, userId, isAdmin = false) => {
  const query = isAdmin ? { _id: orderId } : { _id: orderId, user: userId };
  const order = await Order.findOne(query).populate("items.product");
  if (!order) throw new Error("Order not found");
  return order;
};

export const updateOrderStatus = async (orderId, status, paymentStatus, deliveryStatus) => {
  const order = await Order.findById(orderId);
  if (!order) throw new Error("Order not found");

  if (status) {
    order.status = status;

    if (!deliveryStatus) {
      if (status === "shipped") {
        order.deliveryStatus = "shipping";
      } else if (status === "completed") {
        order.deliveryStatus = "delivered";
      } else if (status === "pending") {
        order.deliveryStatus = "pending";
      }
    }
  }

  if (paymentStatus) {
    order.paymentStatus = paymentStatus;
  }

  if (deliveryStatus) {
    order.deliveryStatus = deliveryStatus;
  }

  await order.save();
  return order;
};

