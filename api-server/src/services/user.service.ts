import bcrypt from "bcrypt";
import { prisma } from "../client/prisma.js";
import type { UserLoginData, UserSignupData } from "../types/user.types.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateToken } from "../utils/generateToken.js";
import { config } from "../utils/config.js";
import jwt from "jsonwebtoken";
import type { TokenData } from "../types/token.types.js";

const signup = async (data: UserSignupData): Promise<ApiResponse> => {
  const { firstName, lastName, email, password } = data;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new ApiError(409, "User already exists");

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      password: hashedPassword,
    },
  });

  return new ApiResponse(201, "User created successfully", { userId: user.id });
};

const login = async (data: UserLoginData): Promise<ApiResponse> => {
  const { email, password } = data;

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      password: true,
    },
  });

  if (!user) throw new ApiError(404, "User not found");

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new ApiError(401, "Invalid credentials");

  const tokenData = {
    userId: user.id,
  };

  const { accessToken, refreshToken } = await generateToken(tokenData);

  return new ApiResponse(200, "Login successful", {
    userId: user.id,
    accessToken,
    refreshToken,
  });
};

const refreshAccessToken = async (incomingRefreshToken: string): Promise<ApiResponse> => {
  const decodedToken = jwt.verify(incomingRefreshToken, config.REFRESH_TOKEN_SECRET) as TokenData;
  const user = await prisma.user.findUnique({
    where: { id: decodedToken.userId },
    select: { id: true, refreshToken: true },
  });

  if (!user) throw new ApiError(401, "Invalid refresh token");
  if (incomingRefreshToken !== user.refreshToken) throw new ApiError(401, "Refresh token is expired or used");

  const tokenData = {
    userId: user.id,
  };

  const { accessToken, refreshToken } = await generateToken(tokenData);

  return new ApiResponse(200, "Access token refreshed", {
    userId: user.id,
    accessToken,
    refreshToken,
  });
};

const logout = async (userId: string): Promise<ApiResponse> => {
  // Remove refresh token
  await prisma.user.update({
    where: { id: userId },
    data: {
      refreshToken: "",
    },
  });

  return new ApiResponse(200, "User logged out successfully", { userId });
};

const getProjects = async (userId: string): Promise<ApiResponse> => {
  const rawProjects = await prisma.project.findMany({
    where: { userId },
    select: {
      id: true,
      name: true,
      deployedUrl: true,
      deployments: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: {
          status: true,
        },
      },
    },
  } as const);

  const projects = rawProjects.map((project) => ({
    id: project.id,
    name: project.name,
    deployedUrl: project.deployedUrl,
    status: project.deployments[0].status,
  }));

  return new ApiResponse(200, "Projects fetched successfully", {
    userId,
    projects,
  });
};

export { signup, login, refreshAccessToken, logout, getProjects };
