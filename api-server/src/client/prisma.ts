import { withAccelerate } from "@prisma/extension-accelerate";
import { config } from "../utils/config.js";
import pkg from "@prisma/client";
const { PrismaClient } = pkg;

export const prisma = new PrismaClient({
  accelerateUrl: config.DATABASE_URL,
}).$extends(withAccelerate());
