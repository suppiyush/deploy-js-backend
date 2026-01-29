import { kafkaProducer } from "../client/kafkaProducer.js";
import { publishLog } from "./publishLog.js";

export class Logger {
  enabled = false;
  initializing = false;
  initialized = false;

  async init() {
    if (this.initialized || this.initializing) return;

    this.initializing = true;

    try {
      await kafkaProducer.connect();

      this.enabled = true;
      this.initialized = true;
      console.log("Kafka connected");
    } catch (err) {
      this.enabled = false;
      console.warn("Kafka unavailable, continuing without logs");
    } finally {
      this.initializing = false;
    }
  }

  async log(message) {
    if (!this.initialized && !this.initializing) {
      await this.init();
    }
    if (!this.enabled) return;

    try {
      await publishLog(message);
    } catch (err) {
      this.enabled = false;
      console.warn("Kafka logging disabled:", err.message);
    }
  }
}
