import type { Response } from "express";
import type { AuthenticatedRequest } from "../types/authRequest.types.js";
import { createProjectSchema } from "../validators/project/createProject.validator.js";
import { ApiError } from "../utils/ApiError.js";

import * as projectService from "../services/project.service.js";
import { projectActionSchema } from "../validators/project/projectAction.validator.js";

const createProject = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const parsedData = createProjectSchema.safeParse(req.body);
    if (!parsedData.success) throw new ApiError(400, parsedData.error.issues[0].message);

    const result = await projectService.createProject({
      ...parsedData.data,
      userId: req.user.userId,
    });

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

const checkStatus = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const projectId = req.params.id;
    const parsedData = projectActionSchema.safeParse({ projectId });
    if (!parsedData.success) throw new ApiError(400, parsedData.error.issues[0].message);

    const { userId } = req.user;
    const result = await projectService.checkStatus({
      ...parsedData.data,
      userId,
    });

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

const deleteProject = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const projectId = req.params.id;
    const parsedData = projectActionSchema.safeParse({ projectId });
    if (!parsedData.success) throw new ApiError(400, parsedData.error.issues[0].message);

    const { userId } = req.user;
    const result = await projectService.deleteProject({
      ...parsedData.data,
      userId,
    });

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

const redeploy = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const projectId = req.params.id;
    const parsedData = projectActionSchema.safeParse({ projectId });
    if (!parsedData.success) throw new ApiError(400, parsedData.error.issues[0].message);

    const { userId } = req.user;
    const result = await projectService.redeploy({
      ...parsedData.data,
      userId,
    });

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

export { createProject, checkStatus, deleteProject, redeploy };
