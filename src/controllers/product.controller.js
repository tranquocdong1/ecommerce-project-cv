import asyncHandler from "express-async-handler";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from "../services/product.service.js";

import cloudinary from "../config/cloudinary.js";
import { success } from "../utils/response.js";

const uploadToCloudinary = (fileBuffer, folder = "products") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    stream.end(fileBuffer);
  });
};

export const create = asyncHandler(async (req, res) => {
  const { name, price, category } = req.body;

  if (!name || !price || !category) {
    throw new Error("name, price and category are required");
  }

  let images = [];

  if (req.files && req.files.length > 0) {
    const uploadPromises = req.files.map((file) =>
      uploadToCloudinary(file.buffer, "products")
    );

    const results = await Promise.all(uploadPromises);

    images = results.map((r) => ({
      url: r.secure_url,
      publicId: r.public_id
    }));
  }

  const product = await createProduct({
    ...req.body,
    price: Number(price),
    images
  });

  success(res, { product }, 201);
});


export const getAll = asyncHandler(async (req, res) => {
  const products = await getProducts(req.query);
  success(res, products);
});

export const getById = asyncHandler(async (req, res) => {
  const product = await getProductById(req.params.id);
  success(res, { product });
});

export const update = asyncHandler(async (req, res) => {
  const product = await updateProduct(req.params.id, req.body);
  success(res, { product });
});

export const remove = asyncHandler(async (req, res) => {
  await deleteProduct(req.params.id);
  success(res, { message: "Product deleted successfully" });
});
