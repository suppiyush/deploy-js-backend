import { RunTaskCommand } from "@aws-sdk/client-ecs";
import { config } from "../config.js";
import { ecsClient } from "../../client/ecsClient.js";

export const uploadEcsTask = async (
  gitRepoUrl: string,
  projectId: string,
  deploymentId: string,
  envObject: Record<string, string>,
) => {
  const envVarsFromObject = Object.entries(envObject).map(([name, value]) => ({ name, value }));

  const command = new RunTaskCommand({
    cluster: config.ECS_CLUSTER,
    taskDefinition: config.ECS_TASK,
    launchType: "FARGATE",
    count: 1,
    networkConfiguration: {
      awsvpcConfiguration: {
        assignPublicIp: "ENABLED",
        subnets: [config.ECS_SUBNET_1, config.ECS_SUBNET_2, config.ECS_SUBNET_3],
        securityGroups: [config.ECS_SECURITY_GROUP],
      },
    },
    overrides: {
      containerOverrides: [
        {
          name: "builder-image",
          environment: [
            ...envVarsFromObject,
            { name: "AWS_REGION", value: config.AWS_REGION },
            { name: "AWS_ACCESS_KEY_ID", value: config.AWS_ACCESS_KEY_ID },
            { name: "AWS_SECRET_ACCESS_KEY", value: config.AWS_SECRET_ACCESS_KEY },

            { name: "S3_BUCKET_NAME", value: config.S3_BUCKET_NAME },

            { name: "GIT_REPOSITORY_URL", value: gitRepoUrl },
            { name: "PROJECT_ID", value: projectId },
            { name: "DEPLOYMENT_ID", value: deploymentId },

            { name: "BUILD_SERVER_TOKEN_SECRET", value: config.BUILD_SERVER_TOKEN_SECRET },
            { name: "BUILD_SERVER_TOKEN_EXPIRY", value: String(config.BUILD_SERVER_TOKEN_EXPIRY) },
            { name: "API_SERVER_URL", value: config.API_SERVER_URL },

            { name: "KAFKA_BROKER_URL", value: config.KAFKA_BROKER_URL },
            { name: "KAFKA_USERNAME", value: config.KAFKA_USERNAME },
            { name: "KAFKA_PASSWORD", value: config.KAFKA_PASSWORD },
            { name: "KAFKA_TOPIC", value: config.KAFKA_TOPIC },
          ],
        },
      ],
    },
  });

  await ecsClient.send(command);
};
