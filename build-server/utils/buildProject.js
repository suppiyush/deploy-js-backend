import { config } from "./config.js";
import { exec } from "child_process";
import { publishLog } from "./publishLog.js";

export async function buildProject() {
  await new Promise((resolve, reject) => {
    const p = exec(
      `git clone ${config.GIT_REPOSITORY_URL} ${config.OUTPUT_DIRECTORY} && \
       cd ${config.OUTPUT_DIRECTORY} && \
       npm install && \
       npm run build`
    );

    p.stdout.on("data", async (data) => {
      console.log(data.toString());
      await publishLog(data.toString());
    });

    p.stderr.on("data", async (data) => {
      console.error(data.toString());
      await publishLog(data.toString());
    });

    p.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`Build process exited with code ${code}`));
      } else {
        resolve();
      }
    });
  });
}
