import asyncHandler from "express-async-handler";
import {
  register as registerService,
  login as loginService,
  refreshSession,
  logout as logoutService
} from "../services/auth.service.js";
import { success } from "../utils/response.js";
import User from "../models/User.js";

const sanitizeUser = (user) => {
  if (!user) return null;
  const obj = user.toObject ? user.toObject() : { ...user };
  delete obj.passwordHash;
  delete obj.refreshToken;
  return obj;
};

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new Error("Name, email and password are required!");
  }

  const user = await registerService({ name, email, password });

  success(res, { user: sanitizeUser(user) }, 201);
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new Error("Email and password are required!");
  }

  const { user, accessToken, refreshToken } = await loginService({
    email,
    password
  });

  success(res, {
    user: sanitizeUser(user),
    accessToken,
    refreshToken
  });
});

export const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken: oldToken } = req.body;

  if (!oldToken) {
    throw new Error("Refresh token is required");
  }

  const tokens = await refreshSession(oldToken);

  success(res, tokens);
});

export const logout = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  await logoutService(userId);

  success(res, { message: "Logged out successfully" });
});

export const getMe = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User is not found");
  }

  success(res, { user: sanitizeUser(user) });
});
