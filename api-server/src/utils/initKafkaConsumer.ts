import { clickHouseClient } from "../client/clickHouseClient.js";
import { kafkaConsumer } from "../client/kafkaConsumer.js";
import { v4 as uuidv4 } from "uuid";

export const initKafkaConsumer = async () => {
  await kafkaConsumer.connect();
  await kafkaConsumer.subscribe({ topics: ["container-logs"] });

  await kafkaConsumer.run({
    autoCommit: false,
    eachBatch: async ({ batch, heartbeat, commitOffsetsIfNecessary, resolveOffset }) => {
      const messages = batch.messages;

      for (const message of messages) {
        const parsedMsg = JSON.parse(message.value.toString());
        const { deploymentId, log } = parsedMsg;

        try {
          await clickHouseClient.insert({
            table: "analytics.log_events",
            values: [{ event_id: uuidv4(), deployment_id: deploymentId, log }],
            format: "JSONEachRow",
          });

          resolveOffset(message.offset);
          await commitOffsetsIfNecessary();
          await heartbeat();
        } catch (err) {
          console.log(err);
        }
      }
    },
  });
};
