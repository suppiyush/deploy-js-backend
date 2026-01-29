import { z } from "zod";

export const createProjectSchema = z.strictObject(
  {
    name: z.string("Project name must be a string").min(1, "Project name is required"),
    gitRepoUrl: z.url("Provide a valid URL"),
    envObject: z.record(
      z.string("Keys must be string"),
      z.string("Values must be string"),
      "envObject must be valid object"
    ),
  },
  "Invalid request parameters"
);
