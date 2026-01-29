import { config } from "./config.js";

const isProduction = config.NODE_ENV === "production";

export const accesssCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  maxAge: config.ACCESS_TOKEN_COOKIE_EXPIRY,
};

export const refreshCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  path: "/user/refresh-token",
  maxAge: config.REFRESH_TOKEN_COOKIE_EXPIRY,
};
