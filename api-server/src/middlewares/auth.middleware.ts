import jwt from "jsonwebtoken";
import type { NextFunction, Response } from "express";
import { ApiError } from "../utils/ApiError.js";
import { config } from "../utils/config.js";
import { prisma } from "../client/prisma.js";
import type { TokenData } from "../types/token.types.js";
import type { AuthenticatedRequest } from "../types/authRequest.types.js";
import { userTokenSchema } from "../validators/token/userToken.validator.js";

const verifyJWT = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    if (!token) throw new ApiError(401, "Unauthorized request");

    let decodedToken: TokenData;

    try {
      const decoded = jwt.verify(token, config.ACCESS_TOKEN_SECRET);
      const parsedDecodedToken = userTokenSchema.parse(decoded);

      decodedToken = parsedDecodedToken;
    } catch {
      throw new ApiError(401, "Invalid access token");
    }

    const user = await prisma.user.findUnique({
      where: {
        id: decodedToken.userId,
      },
      select: {
        id: true,
        refreshToken: true,
      },
    });

    if (!user) throw new ApiError(401, "Invalid Access Token");
    req.user = { userId: user.id, refreshToken: user.refreshToken };

    next();
  } catch (err: any) {
    return res.status(err.statusCode).json({ success: err.success, message: err.message });
  }
};

export { verifyJWT as authMiddleware };
