import type { Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";
import { updateStatusSchema } from "../validators/deployment/updateStatus.validator.js";
import * as deploymentService from "../services/deployment.service.js";
import { getLogsSchema } from "../validators/deployment/checkStatus.validator.js";
import type { AuthenticatedRequest } from "../types/authRequest.types.js";

const getLogs = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId } = req.user;
    const deploymentId = req.params.id;

    const parsedData = getLogsSchema.safeParse({
      userId,
      deploymentId,
    });

    if (!parsedData.success) throw new ApiError(400, parsedData.error.issues[0].message);

    const result = await deploymentService.getLogs(parsedData.data);

    return res.status(result.statusCode).json({
      success: result.success,
      message: result.message,
      data: result.data,
    });
  } catch (err: any) {
    return res
      .status(err.statusCode || 500)
      .json({ success: err.success || false, message: err.message || "Internal Server Error" });
  }
};

const updateStatus = async (req: Request, res: Response) => {
  try {
    const deploymentId = req.params.id;

    const parsedData = updateStatusSchema.safeParse({
      ...req.body,
      deploymentId,
    });

    if (!parsedData.success) throw new ApiError(400, parsedData.error.issues[0].message);

    const result = await deploymentService.updateStatus(parsedData.data);

    return res.status(result.statusCode).json({
      success: result.success,
      message: result.message,
      data: result.data,
    });
  } catch (err: any) {
    return res
      .status(err.statusCode || 500)
      .json({ success: err.success || false, message: err.message || "Internal Server Error" });
  }
};

export { getLogs, updateStatus };
