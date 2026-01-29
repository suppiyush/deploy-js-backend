import { ECSClient } from "@aws-sdk/client-ecs";
import { config } from "../utils/config.js";

const ecsClient = new ECSClient({
  region: config.AWS_REGION,
  credentials: {
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
  },
});

export { ecsClient };
