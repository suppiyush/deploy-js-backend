import { kafkaProducer } from "../client/kafkaProducer.js";
import { config } from "./config.js";

export async function publishLog(log) {
  try {
    const deploymentId = config.DEPLOYMENT_ID;
    console.log(log);

    await kafkaProducer.send({
      topic: config.KAFKA_TOPIC,
      messages: [{ key: "log", value: JSON.stringify({ deploymentId, log }) }],
    });
  } catch {
    console.error("Kafka Connection Error, log couldn't be published");
  }
}
