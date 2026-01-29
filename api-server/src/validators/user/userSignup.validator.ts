import { z } from "zod";

const userSignupSchema = z.strictObject(
  {
    firstName: z.string("First name is required").min(1, "First name is required"),
    lastName: z.string("Last name is required").min(1, "Last name is required"),
    email: z.email("Email must be a valid email address"),
    password: z
      .string("Password is required")
      .min(6, "Password must be at least 6 characters")
      .max(100, "Password must not exceed 100 characters"),
  },
  "Invalid request parameters"
);

export { userSignupSchema };
