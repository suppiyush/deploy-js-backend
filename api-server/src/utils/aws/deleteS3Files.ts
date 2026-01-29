import { DeleteObjectsCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { s3Client } from "../../client/s3Client.js";
import { config } from "../config.js";

export const deleteS3Files = async (projectId: string) => {
  const prefix = `__output/${projectId}/`;
  let continuationToken;

  do {
    // List objects under project prefix
    const listResponse = await s3Client.send(
      new ListObjectsV2Command({
        Bucket: config.S3_BUCKET_NAME,
        Prefix: prefix,
        ContinuationToken: continuationToken,
      })
    );

    if (!listResponse.Contents || listResponse.Contents.length === 0) break;

    // Delete objects in batches (max 1000)
    await s3Client.send(
      new DeleteObjectsCommand({
        Bucket: config.S3_BUCKET_NAME,
        Delete: {
          Objects: listResponse.Contents.map((obj) => ({
            Key: obj.Key,
          })),
        },
      })
    );

    continuationToken = listResponse.NextContinuationToken;
  } while (continuationToken);
};
