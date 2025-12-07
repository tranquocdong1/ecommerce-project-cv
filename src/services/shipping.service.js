import Order from "../models/Order.js";

export const confirmDelivery = async (orderId) => {
    const order = await Order.findById(orderId);
    if (!order) {
        throw new Error("Order not found");
    }

    if (order.deliveryStatus !== "shipping") {
        throw new Error("Order is not in shipping");
    }

    order.deliveryStatus = "delivered";

    if (order.paymentMethod === "cod"){
        order.paymentStatus = "paid";
    }

    if (order.paymentStatus === "paid") {
        order.status = "completed";
    } else {
        order.status = "pending_payment";
    }

    await order.save();
    return order;
}