import { clickHouseClient } from "../client/clickHouseClient.js";
import { prisma } from "../client/prisma.js";
import type { CheckStatusData, UpdateStatusData } from "../types/deployment.types.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getLogs = async (data: CheckStatusData): Promise<ApiResponse> => {
  const { userId, deploymentId } = data;

  const deployment = await prisma.deployment.findUnique({ where: { id: deploymentId }, select: { projectId: true } });
  if (!deployment) throw new ApiError(404, "Deployment Not Found");

  const project = await prisma.project.findUnique({ where: { id: deployment.projectId }, select: { userId: true } });
  if (!project) throw new ApiError(404, "Project Not Found");

  if (project.userId !== userId) throw new ApiError(403, "Forbidden Request");

  const rawLogs = await clickHouseClient.query({
    query: `
    SELECT event_id, deployment_id, log, created_at
    FROM analytics.log_events
    WHERE deployment_id = {deployment_id:String}
  `,
    query_params: {
      deployment_id: deploymentId,
    },
    format: "JSONEachRow",
  });

  const logs = await rawLogs.json();

  return new ApiResponse(200, "Project status updated successfully", { deploymentId, logs });
};

const updateStatus = async (data: UpdateStatusData): Promise<ApiResponse> => {
  const { deploymentId, status } = data;

  const deployment = await prisma.deployment.findUnique({ where: { id: deploymentId } });
  if (!deployment) throw new ApiError(404, "Deployment Not Found");

  await prisma.deployment.update({
    where: {
      id: deploymentId,
    },
    data: {
      status,
    },
  });

  return new ApiResponse(200, "Project status updated successfully", { deploymentId, status });
};

export { getLogs, updateStatus };
