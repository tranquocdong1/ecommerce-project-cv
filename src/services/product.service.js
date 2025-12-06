import Product from "../models/Product.js";
import slugify from "slugify";

export const createProduct = async (data) => {
  const { name, price, discountPercent, category } = data;

  const slug = slugify(name, { lower: true });

  const product = await Product.create({
    ...data,
    slug,
    finalPrice: price - (price * (discountPercent || 0)) / 100
  });

  return product;
};

export const getProducts = async ({
  page = 1,
  limit = 10,
  search = "",
  category,
  sort = "-createdAt",
  minPrice,
  maxPrice
}) => {
  const query = {};

  // Search
  if (search) {
    query.name = { $regex: search, $options: "i" };
  }

  // Filter by category
  if (category) query.category = category;

  // Price filter
  if (minPrice) query.finalPrice = { ...query.finalPrice, $gte: minPrice };
  if (maxPrice) query.finalPrice = { ...query.finalPrice, $lte: maxPrice };

  const skip = (page - 1) * limit;

  const products = await Product.find(query)
    .populate("category")
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const total = await Product.countDocuments(query);

  return {
    products,
    total,
    page,
    pages: Math.ceil(total / limit)
  };
};

export const getProductById = async (id) => {
  const product = await Product.findById(id).populate("category");
  if (!product) throw new Error("Product not found");
  return product;
};

export const updateProduct = async (id, data) => {
  const product = await Product.findById(id);
  if (!product) throw new Error("Product not found");

  Object.assign(product, data);

  if (data.name) {
    product.slug = slugify(data.name, { lower: true });
  }

  await product.save();
  return product;
};

export const deleteProduct = async (id) => {
  const product = await Product.findById(id);
  if (!product) throw new Error("Product not found");
  await product.deleteOne();
  return true;
};
