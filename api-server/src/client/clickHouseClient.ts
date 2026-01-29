import { createClient } from "@clickhouse/client";
import { config } from "../utils/config.js";

export const clickHouseClient = createClient({
  url: config.CLICKHOUSE_HOST,
  database: config.CLICKHOUSE_DB,
  username: config.CLICKHOUSE_USERNAME,
  password: config.CLICKHOUSE_PASSWORD,
});
