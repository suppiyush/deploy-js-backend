import dotenv from "dotenv";
import { configSchema } from "../validators/config/config.validator.js";
dotenv.config();

const config = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,

  DATABASE_URL: process.env.DATABASE_URL,

  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY,
  ACCESS_TOKEN_COOKIE_EXPIRY: process.env.ACCESS_TOKEN_COOKIE_EXPIRY,

  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY,
  REFRESH_TOKEN_COOKIE_EXPIRY: process.env.REFRESH_TOKEN_COOKIE_EXPIRY,

  AWS_REGION: process.env.AWS_REGION,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,

  ECS_CLUSTER: process.env.ECS_CLUSTER,
  ECS_TASK: process.env.ECS_TASK,
  ECS_SUBNET_1: process.env.ECS_SUBNET_1,
  ECS_SUBNET_2: process.env.ECS_SUBNET_2,
  ECS_SUBNET_3: process.env.ECS_SUBNET_3,
  ECS_SECURITY_GROUP: process.env.ECS_SECURITY_GROUP,

  MAX_PROJECTS_PER_USER: process.env.MAX_PROJECTS_PER_USER,
  MAX_PROJECTS: process.env.MAX_PROJECTS,

  S3_PROXY_URL: process.env.S3_PROXY_URL,
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,

  BUILD_SERVER_TOKEN_SECRET: process.env.BUILD_SERVER_TOKEN_SECRET,
  BUILD_SERVER_TOKEN_EXPIRY: process.env.BUILD_SERVER_TOKEN_EXPIRY,
  API_SERVER_URL: process.env.API_SERVER_URL,

  KAFKA_BROKER_URL: process.env.KAFKA_BROKER_URL,
  KAFKA_USERNAME: process.env.KAFKA_USERNAME,
  KAFKA_PASSWORD: process.env.KAFKA_PASSWORD,
  KAFKA_TOPIC: process.env.KAFKA_TOPIC,

  CLICKHOUSE_HOST: process.env.CLICKHOUSE_HOST,
  CLICKHOUSE_DB: process.env.CLICKHOUSE_DB,
  CLICKHOUSE_USERNAME: process.env.CLICKHOUSE_USERNAME,
  CLICKHOUSE_PASSWORD: process.env.CLICKHOUSE_PASSWORD,
};

const parsedConfig = configSchema.safeParse(config);
if (!parsedConfig.success) throw new Error(parsedConfig.error.issues[0].message);

const configData = parsedConfig.data;
export { configData as config };
