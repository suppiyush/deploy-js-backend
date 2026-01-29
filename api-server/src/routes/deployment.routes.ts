import { Router } from "express";
import { buildAuthMiddleware } from "../middlewares/buildAuth.middleware.js";
import * as deploymentController from "../controllers/deployment.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/:id/logs", authMiddleware, deploymentController.getLogs);
// Build-Server updates the status
router.patch("/:id/status", buildAuthMiddleware, deploymentController.updateStatus);

export { router as deploymentRouter };
