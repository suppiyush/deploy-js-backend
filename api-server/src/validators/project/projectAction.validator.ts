import { z } from "zod";

export const projectActionSchema = z.strictObject(
  {
    projectId: z.string("Project ID must be a string").min(1, "Project ID can't be empty"),
  },
  "Invalid request parameters"
);
