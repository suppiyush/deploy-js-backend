import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import * as projectController from "../controllers/project.controller.js";

const router = Router();

router.post("/", authMiddleware, projectController.createProject);
router.delete("/:id", authMiddleware, projectController.deleteProject);
router.post("/:id/redeploy", authMiddleware, projectController.redeploy);
router.get("/:id/status", authMiddleware, projectController.checkStatus);

export { router as projectRouter };
