import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outDirPath = path.resolve(__dirname, "..", "output");

export const config = {
  // AWS Configuration
  AWS_REGION: process.env.AWS_REGION,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,

  // S3 Configuration
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
  OUTPUT_DIRECTORY: outDirPath,

  // Project Configurations
  GIT_REPOSITORY_URL: process.env.GIT_REPOSITORY_URL,
  PROJECT_ID: process.env.PROJECT_ID,
  DEPLOYMENT_ID: process.env.DEPLOYMENT_ID,

  // Server Authentication Config
  BUILD_SERVER_TOKEN_SECRET: process.env.BUILD_SERVER_TOKEN_SECRET,
  BUILD_SERVER_TOKEN_EXPIRY: process.env.BUILD_SERVER_TOKEN_EXPIRY,
  API_SERVER_URL: process.env.API_SERVER_URL,

  // Kafka Configuration
  KAFKA_BROKER_URL: process.env.KAFKA_BROKER_URL,
  KAFKA_USERNAME: process.env.KAFKA_USERNAME,
  KAFKA_PASSWORD: process.env.KAFKA_PASSWORD,
  KAFKA_TOPIC: process.env.KAFKA_TOPIC,
};

// Validate all config values
for (const [key, value] of Object.entries(config)) {
  if (value === undefined || value === null || value === "") {
    throw new Error(`Missing required configuration: ${key}`);
  }
}
