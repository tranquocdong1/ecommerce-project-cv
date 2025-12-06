import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

export const getCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate("items.product");

  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }

  return cart;
};

export const addToCart = async (userId, productId, quantity = 1) => {
  const product = await Product.findById(productId);
  if (!product) throw new Error("Product not found");

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: [{ product: productId, quantity }]
    });
    return cart;
  }

  const existingItem = cart.items.find((i) => i.product.toString() === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity });
  }

  await cart.save();
  return await cart.populate("items.product");
};

export const updateQuantity = async (userId, productId, quantity) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new Error("Cart not found");

  const item = cart.items.find((i) => i.product.toString() === productId);
  if (!item) throw new Error("Item not found in cart");

  item.quantity = quantity;

  await cart.save();
  return await cart.populate("items.product");
};

export const removeItem = async (userId, productId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new Error("Cart not found");

  cart.items = cart.items.filter((i) => i.product.toString() !== productId);

  await cart.save();
  return await cart.populate("items.product");
};

export const clearCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new Error("Cart not found");

  cart.items = [];
  await cart.save();
  return cart;
};
