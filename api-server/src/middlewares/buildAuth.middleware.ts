import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { config } from "../utils/config.js";
import { buildTokenSchema } from "../validators/token/buildToken.validator.js";

export const buildAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) throw new ApiError(401, "Unauthorized request");

    try {
      const decoded = jwt.verify(token, config.BUILD_SERVER_TOKEN_SECRET);
      buildTokenSchema.parse(decoded);
    } catch {
      throw new ApiError(401, "Invalid access token");
    }
    next();
  } catch (err: any) {
    return res.status(err.statusCode).json({ success: err.success, message: err.message });
  }
};
