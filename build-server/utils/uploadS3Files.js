import path from "path";
import fs from "fs";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import mime from "mime-types";
import { config } from "../utils/config.js";
import { s3Client } from "../client/s3Client.js";
import { publishLog } from "./publishLog.js";

export async function uploadS3Files() {
  const distFolderPath = path.join(config.OUTPUT_DIRECTORY, "dist");
  const distFolderContents = fs.readdirSync(distFolderPath, {
    recursive: true,
  });

  for (const file of distFolderContents) {
    const filePath = path.join(distFolderPath, file);
    if (fs.lstatSync(filePath).isDirectory()) continue;

    await publishLog(`Uploading file: ${file}`);

    const command = new PutObjectCommand({
      Bucket: config.S3_BUCKET_NAME,
      Key: `__output/${config.PROJECT_ID}/${file}`,
      Body: fs.readFileSync(filePath),
      ContentType: mime.lookup(filePath) || "application/octet-stream",
    });

    await s3Client.send(command);
    await publishLog(`Uploaded file: ${file}`);
  }
}
