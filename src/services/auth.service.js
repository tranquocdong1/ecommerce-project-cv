import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const createAccessToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
};

export const createRefreshToken = (user) => {
  return jwt.sign(
    {
      userId: user._id
    },
    process.env.JWT_REFRESH_SECRET, 
    { expiresIn: "7d" }
  );
};

export const register = async ({ name, email, password }) => {
  const exists = await User.findOne({ email });
  if (exists) throw new Error("Email already registered");

  const passwordHash = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    name,
    email,
    passwordHash,
  });

  return newUser;
};

export const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid email or password");

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) throw new Error("Invalid email or password");

  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save();

  return {
    user,
    accessToken,
    refreshToken
  };
};

export const refreshSession = async (oldToken) => {
  if (!oldToken) throw new Error("Missing refresh token");

  const user = await User.findOne({ refreshToken: oldToken });
  if (!user) throw new Error("Invalid refresh token");

  let decoded;
  try {
    decoded = jwt.verify(oldToken, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    throw new Error("Expired or invalid refresh token");
  }

  const newAccessToken = createAccessToken(user);
  const newRefreshToken = createRefreshToken(user);

  user.refreshToken = newRefreshToken;
  await user.save();

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken
  };
};

export const logout = async (userId) => {
  const user = await User.findById(userId);
  if (user) {
    user.refreshToken = null;
    await user.save();
  }
  return true;
};
