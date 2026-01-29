import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import type { RateLimitConfig } from "../types/rateLimit.types.js";
import type { Request } from "express";

const createRateLimiter = (config: RateLimitConfig) => {
  return rateLimit({
    windowMs: config.windowMs,
    max: config.max,
    keyGenerator: (req: Request) => ipKeyGenerator(req.ip),
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_, res) => {
      res.status(429).json({
        error: "Rate limit exceeded",
        message: config.message,
      });
    },
  });
};

const RATE_LIMIT_TIERS = {
  AUTH: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // 7 attempts per 15 minutes per IP
    message: "Too many attempts. Please try again in 15 minutes.",
  },

  PROJECT: {
    windowMs: 30 * 60 * 1000, // 30 minutes
    max: 10, // 5 attempts per 30 minutes per IP
    message: "Too many requests. Please try again in 30 minutes.",
  },

  GLOBAL: {
    windowMs: 60 * 1000, // 1 minute
    max: 100, // 100 requests per minute per IP
    message: "Too many requests. Please try again in 1 minute.",
  },
};

export const rateLimiters = {
  auth: createRateLimiter(RATE_LIMIT_TIERS.AUTH),
  project: createRateLimiter(RATE_LIMIT_TIERS.PROJECT),
  global: createRateLimiter(RATE_LIMIT_TIERS.GLOBAL),
};
