import { z } from "zod";

export const buildTokenSchema = z.object({
  role: z.literal("BUILD_SERVER", "Role must be valid"),
});
