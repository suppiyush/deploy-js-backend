import { Kafka, logLevel } from "kafkajs";
import { config } from "../utils/config.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const kafkaClient = new Kafka({
  clientId: `api-server`,
  brokers: [`${config.KAFKA_BROKER_URL}`],
  ssl: {
    ca: [fs.readFileSync(path.join(__dirname, "kafka.pem"), "utf-8")],
  },
  sasl: {
    username: config.KAFKA_USERNAME,
    password: config.KAFKA_PASSWORD,
    mechanism: "plain",
  },
  logLevel: logLevel.NOTHING,
});

export const kafkaConsumer = kafkaClient.consumer({ groupId: "api-server-logs-consumer" });
