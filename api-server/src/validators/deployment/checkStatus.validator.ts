import { z } from "zod";

export const getLogsSchema = z.strictObject(
  {
    userId: z.string().min(1, "User Id can't be empty"),
    deploymentId: z.string().min(1, "Deployment Id can't be empty"),
  },
  "Invalid request parameters"
);
