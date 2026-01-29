import type { SignOptions } from "jsonwebtoken";
import { z } from "zod";

export const configSchema = z.object({
  PORT: z.coerce
    .number("PORT must be a valid number")
    .positive("PORT must be a positive number")
    .max(65535, "PORT must be less than or equal to 65535"),

  NODE_ENV: z.enum(["development", "production"], "NODE_ENV must be either 'development' or 'production'"),
  DATABASE_URL: z.string("DATABASE_URL must be a string").min(1, "DATABASE_URL cannot be empty"),
  ACCESS_TOKEN_SECRET: z.string("ACCESS_TOKEN_SECRET must be a string").min(1, "ACCESS_TOKEN_SECRET cannot be empty"),

  ACCESS_TOKEN_EXPIRY: z.union(
    [
      z.number("ACCESS_TOKEN_EXPIRY must be number").positive("ACCESS_TOKEN_EXPIRY must be a positive number"),
      z
        .string("ACCESS_TOKEN_EXPIRY must be a string")
        .regex(/^\d+(ms|s|m|h|d)$/, "ACCESS_TOKEN_EXPIRY must be a valid duration"),
    ],
    "ACCESS_TOKEN_EXPIRY must be a valid duration (e.g. 500ms, 60s, 15m, 1h, 7d)"
  ) as z.ZodType<SignOptions["expiresIn"]>,

  ACCESS_TOKEN_COOKIE_EXPIRY: z.coerce
    .number("ACCESS_TOKEN_COOKIE_EXPIRY must be a number")
    .positive("ACCESS_TOKEN_COOKIE_EXPIRY must be a positive number"),

  REFRESH_TOKEN_SECRET: z
    .string("REFRESH_TOKEN_SECRET must be a string")
    .min(1, "REFRESH_TOKEN_SECRET cannot be empty"),

  REFRESH_TOKEN_EXPIRY: z.union(
    [
      z
        .number("REFRESH_TOKEN_EXPIRY must be a valid number")
        .positive("REFRESH_TOKEN_EXPIRY must be a positive number"),
      z
        .string("REFRESH_TOKEN_EXPIRY must be a string")
        .regex(/^\d+(ms|s|m|h|d)$/, "REFRESH_TOKEN_EXPIRY must be a valid duration"),
    ],
    "REFRESH_TOKEN_EXPIRY must be a valid duration (e.g. 500ms, 60s, 15m, 1h, 7d)"
  ) as z.ZodType<SignOptions["expiresIn"]>,

  REFRESH_TOKEN_COOKIE_EXPIRY: z.coerce
    .number("REFRESH_TOKEN_COOKIE_EXPIRY must be a valid number")
    .positive("REFRESH_TOKEN_COOKIE_EXPIRY must be a positive number"),

  AWS_REGION: z.string("AWS_REGION must be a string").min(1, "AWS_REGION cannot be empty"),
  AWS_ACCESS_KEY_ID: z.string("AWS_ACCESS_KEY_ID must be a string").min(1, "AWS_ACCESS_KEY_ID cannot be empty"),
  AWS_SECRET_ACCESS_KEY: z
    .string("AWS_SECRET_ACCESS_KEY must be a string")
    .min(1, "AWS_SECRET_ACCESS_KEY cannot be empty"),

  ECS_CLUSTER: z.string("ECS_CLUSTER must be a string").min(1, "ECS_CLUSTER cannot be empty"),
  ECS_TASK: z.string("ECS_TASK must be a string").min(1, "ECS_TASK cannot be empty"),
  ECS_SUBNET_1: z.string("ECS_SUBNET_1 must be a string").min(1, "ECS_SUBNET_1 cannot be empty"),
  ECS_SUBNET_2: z.string("ECS_SUBNET_2 must be a string").min(1, "ECS_SUBNET_2 cannot be empty"),
  ECS_SUBNET_3: z.string("ECS_SUBNET_3 must be a string").min(1, "ECS_SUBNET_3 cannot be empty"),
  ECS_SECURITY_GROUP: z.string("ECS_SECURITY_GROUP must be a string").min(1, "ECS_SECURITY_GROUP cannot be empty"),

  MAX_PROJECTS_PER_USER: z.coerce
    .number("MAX_PROJECTS_PER_USER must be a valid number")
    .positive("MAX_PROJECTS_PER_USER must be a positive number"),

  MAX_PROJECTS: z.coerce
    .number("MAX_PROJECTS must be a valid number")
    .positive("MAX_PROJECTS must be a positive number"),

  S3_PROXY_URL: z.url("S3_PROXY_URL must be a valid url"),
  S3_BUCKET_NAME: z.string("S3_BUCKET_NAME must be a string").min(1, "S3_BUCKET_NAME cannot be empty"),

  BUILD_SERVER_TOKEN_SECRET: z
    .string("BUILD_SERVER_TOKEN_SECRET must be a string")
    .min(1, "BUILD_SERVER_TOKEN_SECRET cannot be empty"),

  BUILD_SERVER_TOKEN_EXPIRY: z.union(
    [
      z
        .number("BUILD_SERVER_TOKEN_EXPIRY must be a valid number")
        .positive("BUILD_SERVER_TOKEN_EXPIRY must be a positive number"),
      z
        .string("BUILD_SERVER_TOKEN_EXPIRY must be a string")
        .regex(/^\d+(ms|s|m|h|d)$/, "BUILD_SERVER_TOKEN_EXPIRY must be a valid duration"),
    ],
    "BUILD_SERVER_TOKEN_EXPIRY must be a valid duration (e.g. 500ms, 60s, 15m, 1h, 7d)"
  ) as z.ZodType<SignOptions["expiresIn"]>,

  API_SERVER_URL: z.url("API_SERVER_URL must be a valid url"),

  KAFKA_BROKER_URL: z.string("KAFKA_BROKER_URL must be a string").min(1, "KAFKA_BROKER_URL cannot be empty"),
  KAFKA_USERNAME: z.string("KAFKA_USERNAME must be a string").min(1, "KAFKA_USERNAME cannot be empty"),
  KAFKA_PASSWORD: z.string("KAFKA_PASSWORD must be a string").min(1, "KAFKA_PASSWORD cannot be empty"),
  KAFKA_TOPIC: z.string("KAFKA_TOPIC must be a string").min(1, "KAFKA_TOPIC cannot be empty"),

  CLICKHOUSE_HOST: z.string("CLICKHOUSE_HOST must be a string").min(1, "CLICKHOUSE_HOST cannot be empty"),
  CLICKHOUSE_DB: z.string("CLICKHOUSE_DB must be a string").min(1, "CLICKHOUSE_DB cannot be empty"),
  CLICKHOUSE_USERNAME: z.string("CLICKHOUSE_USERNAME must be a string").min(1, "CLICKHOUSE_USERNAME cannot be empty"),
  CLICKHOUSE_PASSWORD: z.string("CLICKHOUSE_PASSWORD must be a string").min(1, "CLICKHOUSE_PASSWORD cannot be empty"),
});
