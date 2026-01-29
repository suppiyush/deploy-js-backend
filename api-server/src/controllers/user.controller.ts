import type { Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";

import { userLoginSchema } from "../validators/user/userLogin.validator.js";
import { userSignupSchema } from "../validators/user/userSignup.validator.js";
import * as userService from "../services/user.service.js";
import { accesssCookieOptions, refreshCookieOptions } from "../utils/cookieOptions.js";
import type { AuthenticatedRequest } from "../types/authRequest.types.js";

const signup = async (req: Request, res: Response) => {
  try {
    const parsedData = userSignupSchema.safeParse(req.body);
    if (!parsedData.success) throw new ApiError(400, parsedData.error.issues[0].message);

    const result = await userService.signup(parsedData.data);

    return res.status(result.statusCode).json({
      success: result.success,
      message: result.message,
      data: result.data,
    });
  } catch (err: any) {
    return res
      .status(err.statusCode || 500)
      .json({ success: err.success || false, message: err.message || "Internal Server Error" });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const parsedData = userLoginSchema.safeParse(req.body);
    if (!parsedData.success) throw new ApiError(400, parsedData.error.issues[0].message);

    const result = await userService.login(parsedData.data);
    const { userId, refreshToken, accessToken } = result.data;

    return res
      .status(result.statusCode)
      .cookie("refreshToken", refreshToken, refreshCookieOptions)
      .cookie("accessToken", accessToken, accesssCookieOptions)
      .json({ success: result.success, message: result.message, data: { userId } });
  } catch (err: any) {
    return res
      .status(err.statusCode || 500)
      .json({ success: err.success || false, message: err.message || "Internal Server Error" });
  }
};

const refreshAccessToken = async (req: Request, res: Response) => {
  try {
    const incomingRefreshToken = req.cookies.refreshToken;
    if (!incomingRefreshToken) throw new ApiError(400, "Refresh Token not found");

    const result = await userService.refreshAccessToken(incomingRefreshToken);
    const { userId, refreshToken, accessToken } = result.data;

    return res
      .status(result.statusCode)
      .cookie("refreshToken", refreshToken, refreshCookieOptions)
      .cookie("accessToken", accessToken, accesssCookieOptions)
      .json({ success: result.success, message: result.message, data: { userId } });
  } catch (err: any) {
    return res
      .status(err.statusCode || 500)
      .json({ success: err.success || false, message: err.message || "Internal Server Error" });
  }
};

const logout = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId } = req.user;
    const result = await userService.logout(userId);

    return res
      .status(result.statusCode)
      .clearCookie("refreshToken", refreshCookieOptions)
      .clearCookie("accessToken", accesssCookieOptions)
      .json({ success: result.success, message: result.message, data: { userId } });
  } catch (err: any) {
    return res
      .status(err.statusCode || 500)
      .json({ success: err.success || false, message: err.message || "Internal Server Error" });
  }
};

const getProjects = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId } = req.user;
    const result = await userService.getProjects(userId);

    return res.status(result.statusCode).json({
      success: result.success,
      message: result.message,
      data: result.data,
    });
  } catch (err: any) {
    return res
      .status(err.statusCode || 500)
      .json({ success: err.success || false, message: err.message || "Internal Server Error" });
  }
};

export { signup, login, refreshAccessToken, logout, getProjects };
