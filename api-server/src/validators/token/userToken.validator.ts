import { z } from "zod";

export const userTokenSchema = z.object({
  userId: z.string("User ID must be a string").min(1, "User ID can't be empty"),
});
