import { Kafka, logLevel } from "kafkajs";
import { config } from "../utils/config.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const kafkaClient = new Kafka({
  clientId: `docker-build-server-${config.DEPLOYMENT_ID}`,
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

export const kafkaProducer = kafkaClient.producer();
