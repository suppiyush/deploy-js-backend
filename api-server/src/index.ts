import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { userRouter } from "./routes/user.routes.js";
import { projectRouter } from "./routes/project.routes.js";
import { deploymentRouter } from "./routes/deployment.routes.js";
import { initKafkaConsumer } from "./utils/initKafkaConsumer.js";
import { config } from "./utils/config.js";
import { rateLimiters } from "./middlewares/rateLimit.middleware.js";

const app = express();
const PORT = config.PORT;

// Whitelist required domains for CORS
app.use(cors());
app.use(rateLimiters.global);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/user", userRouter);
app.use("/project", rateLimiters.project, projectRouter);
app.use("/deployment", deploymentRouter);

initKafkaConsumer();
app.listen(PORT, () => console.log(`API Server running at Port ${PORT} in ${config.NODE_ENV} mode`));

export { app };
