import { z } from "zod";
import { projectStatus } from "../../types/deployment.types.js";

export const updateStatusSchema = z.strictObject(
  {
    deploymentId: z.string().min(1, "Deployment Id can't be empty"),
    status: z.enum(projectStatus, "Status must be a valid status"),
  },
  "Invalid request parameters"
);
