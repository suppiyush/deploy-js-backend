import { ApiError } from "./ApiError.js";
import jwt from "jsonwebtoken";
import { config } from "./config.js";
import { prisma } from "../client/prisma.js";
import type { TokenData } from "../types/token.types.js";

const generateAccessToken = (tokenData: TokenData) => {
  return jwt.sign({ userId: tokenData.userId }, config.ACCESS_TOKEN_SECRET, {
    expiresIn: config.ACCESS_TOKEN_EXPIRY,
  });
};

const generateRefreshToken = (tokenData: TokenData) => {
  return jwt.sign({ userId: tokenData.userId }, config.REFRESH_TOKEN_SECRET, {
    expiresIn: config.REFRESH_TOKEN_EXPIRY,
  });
};

export const generateToken = async (tokenData: TokenData) => {
  try {
    const accessToken = generateAccessToken(tokenData);
    const refreshToken = generateRefreshToken(tokenData);

    await prisma.user.update({
      where: { id: tokenData.userId },
      data: { refreshToken },
    });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(401, "Error generating tokens");
  }
};
