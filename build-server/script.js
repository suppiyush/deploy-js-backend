import dotenv from "dotenv";
dotenv.config();

import { updateStatus } from "./utils/updateStatus.js";
import { buildProject } from "./utils/buildProject.js";
import { uploadS3Files } from "./utils/uploadS3Files.js";
import { Logger } from "./utils/logger.js";
import { kafkaProducer } from "./client/kafkaProducer.js";
import { publishLog } from "./utils/publishLog.js";

async function init() {
  console.log("Executing Script...");
  const logger = new Logger();

  try {
    await logger.log("Build Started...");

    await buildProject();
    await logger.log("Build Completed.");

    await uploadS3Files();
    await logger.log("All files uploaded successfully.");

    await updateStatus("DEPLOYED");
    await logger.log("Deployment status updated to DEPLOYED.");
    process.exit(0);
  } catch (err) {
    await logger.log(err?.stack || err);
    await updateStatus("FAILED");
    process.exit(1);
  }
}

init();
