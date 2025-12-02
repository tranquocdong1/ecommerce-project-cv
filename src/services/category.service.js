import Category from "../models/Category.js";
import slugify from "slugify";

export const createCategory = async ({ name, description }) => {
  const exists = await Category.findOne({ name });
  if (exists) throw new Error("Category already exists");

  const category = await Category.create({
    name,
    slug: slugify(name, { lower: true }),
    description: description || ""
  });

  return category;
};

export const getAllCategories = async () => {
  return await Category.find().sort({ createdAt: -1 });
};

export const getCategoryById = async (id) => {
  const category = await Category.findById(id);
  if (!category) throw new Error("Category not found");
  return category;
};

export const updateCategory = async (id, data) => {
  const category = await Category.findById(id);
  if (!category) throw new Error("Category not found");

  if (data.name) {
    category.name = data.name;
    category.slug = slugify(data.name, { lower: true });
  }

  if (data.description !== undefined) {
    category.description = data.description;
  }

  await category.save();
  return category;
};

export const deleteCategory = async (id) => {
  const category = await Category.findById(id);
  if (!category) throw new Error("Category not found");

  await category.deleteOne();
  return true;
};
