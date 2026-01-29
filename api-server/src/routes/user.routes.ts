import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { rateLimiters } from "../middlewares/rateLimit.middleware.js";

const router = Router();

router.post("/signup", rateLimiters.auth, userController.signup);
router.post("/login", rateLimiters.auth, userController.login);
router.post("/refresh-token", rateLimiters.auth, userController.refreshAccessToken);
router.post("/logout", authMiddleware, userController.logout);
router.get("/projects", rateLimiters.auth, authMiddleware, userController.getProjects);

export { router as userRouter };
