import { z } from "zod";

const userLoginSchema = z.strictObject(
  {
    email: z.email("Email must be a valid email address"),
    password: z
      .string("Password is required")
      .min(6, "Password must be at least 6 characters")
      .max(100, "Password must not exceed 100 characters"),
  },
  "Invalid request parameters"
);

export { userLoginSchema };
