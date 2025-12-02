import asyncHandler from "express-async-handler";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
} from "../services/category.service.js";

import { success } from "../utils/response.js";

export const create = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name) throw new Error("Category name is required");

  const category = await createCategory({ name, description });
  success(res, { category }, 201);
});

export const getAll = asyncHandler(async (req, res) => {
  const categories = await getAllCategories();
  success(res, { categories });
});

export const getById = asyncHandler(async (req, res) => {
  const category = await getCategoryById(req.params.id);
  success(res, { category });
});

export const update = asyncHandler(async (req, res) => {
  const category = await updateCategory(req.params.id, req.body);
  success(res, { category });
});

export const remove = asyncHandler(async (req, res) => {
  await deleteCategory(req.params.id);
  success(res, { message: "Category deleted successfully" });
});
