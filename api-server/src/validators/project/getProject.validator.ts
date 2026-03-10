import { z } from "zod";

export const getProjectSchema = z.strictObject(
  {
    projectId: z.string("Project ID must be a string").min(1, "Project ID is required"),
  },
  "Invalid request parameters",
);
