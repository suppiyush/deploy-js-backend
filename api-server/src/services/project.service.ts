import { ApiResponse } from "../utils/ApiResponse.js";
import { config } from "../utils/config.js";
import { prisma } from "../client/prisma.js";
import { checkRepoExists } from "../utils/checkRepoExists.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadEcsTask } from "../utils/aws/uploadEcsTask.js";
import { deleteS3Files } from "../utils/aws/deleteS3Files.js";
import type { CreateProjectData, ProjectActionData } from "../types/project.types.js";

const createProject = async (data: CreateProjectData): Promise<ApiResponse> => {
  const { name, userId, gitRepoUrl, envObject } = data;

  // Checking if the repo exits
  const repoExists = await checkRepoExists(gitRepoUrl);
  if (!repoExists) throw new ApiError(400, "Please provide a valid github url");

  // Limiting user to create at max 5 projects
  const noOfUserProjects = await prisma.project.count({ where: { userId } });

  if (noOfUserProjects >= config.MAX_PROJECTS_PER_USER)
    throw new ApiError(403, "You can create a maximum of 5 projects");

  // Adding resource constraint
  const totalProjects = await prisma.project.count();
  if (totalProjects >= config.MAX_PROJECTS) {
    throw new ApiError(507, "The system has reached its maximum project capacity");
  }

  const project = await prisma.project.create({
    data: {
      name,
      userId,
      gitRepoUrl,
      envObject,
      deployments: {
        create: {
          status: "PENDING",
        },
      },
    },
    select: {
      id: true,
      deployments: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: {
          id: true,
        },
      },
    },
  } as const);

  const projectId = project.id;
  const deploymentId = project.deployments[0].id;

  // Spin ECS Container
  await uploadEcsTask(gitRepoUrl, projectId, deploymentId, envObject);

  const baseUrl = new URL(config.S3_PROXY_URL);
  const deployedUrl = `${baseUrl.protocol}//${projectId}.${baseUrl.hostname}${baseUrl.port ? `:${baseUrl.port}` : ""}`;

  await prisma.$transaction(async (tx) => {
    await tx.project.update({
      where: {
        id: projectId,
      },
      data: {
        deployedUrl,
      },
    });

    await tx.deployment.update({
      where: {
        id: deploymentId,
      },
      data: {
        status: "BUILDING",
      },
    });
  });

  return new ApiResponse(200, "Project deployment started successfully", {
    projectId,
    deploymentId,
    deployedUrl,
  });
};

const checkStatus = async (data: ProjectActionData): Promise<ApiResponse> => {
  const { userId, projectId } = data;

  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
    select: {
      userId: true,
      deployments: {
        orderBy: {
          createdAt: "desc",
        },
        select: {
          status: true,
        },
      },
    },
  } as const);

  if (!project) throw new ApiError(404, "Project not found");

  // Checking if the project belongs to same User
  if (project.userId !== userId) throw new ApiError(403, "Forbidden Request");

  const deployment = project.deployments[0];
  if (!deployment) throw new ApiError(404, "No deployment found");

  return new ApiResponse(200, "Project status fetched successfully", { projectId, status: deployment.status });
};

const deleteProject = async (data: ProjectActionData): Promise<ApiResponse> => {
  const { userId, projectId } = data;

  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
    select: {
      userId: true,
      deployments: {
        orderBy: {
          createdAt: "desc",
        },
        select: {
          status: true,
        },
      },
    },
  } as const);

  if (!project) throw new ApiError(404, "Project not found");

  // Checking if the project belongs to same User
  if (project.userId !== userId) throw new ApiError(403, "Forbidden Request");

  const deployment = project.deployments[0];
  if (!deployment) throw new ApiError(404, "No deployment found");
  if (deployment.status !== "DEPLOYED") throw new ApiError(409, "Project must be DEPLOYED to perform this action");

  // Deleting from S3 Bucket
  await deleteS3Files(projectId);

  // Deleting from DB
  await prisma.project.delete({
    where: {
      id: projectId,
    },
    select: {
      id: true,
    },
  });

  return new ApiResponse(200, "Project deleted successfully", { projectId });
};

const redeploy = async (data: ProjectActionData): Promise<ApiResponse> => {
  const { userId, projectId } = data;

  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
    select: {
      gitRepoUrl: true,
      deployedUrl: true,
      envObject: true,
      userId: true,
      deployments: {
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          status: true,
        },
      },
    },
  } as const);

  if (!project) throw new ApiError(404, "Project not found");

  // Checking if the project belongs to same User
  if (project.userId !== userId) throw new ApiError(403, "Forbidden Request");

  const deployment = project.deployments[0];
  if (!deployment) throw new ApiError(404, "No deployment found");
  if (deployment.status !== "DEPLOYED") throw new ApiError(409, "Project must be DEPLOYED to perform this action");

  // Deleting from S3 Bucket
  await deleteS3Files(projectId);

  const { gitRepoUrl, deployedUrl } = project;
  const envObject = project.envObject as Record<string, string>;

  const deploymentId = deployment.id;

  // Checking if the repo exits (maybe its deleted now)
  const repoExists = await checkRepoExists(gitRepoUrl);
  if (!repoExists) throw new ApiError(400, "Please provide a valid github url");

  const newDeployment = await prisma.deployment.create({
    data: {
      projectId,
      status: "BUILDING",
    },
    select: {
      id: true,
    },
  });

  // Spin ECS Container
  await uploadEcsTask(gitRepoUrl, projectId, newDeployment.id, envObject);

  await prisma.deployment.update({
    where: {
      id: deploymentId,
    },
    data: {
      status: "SUPERSEDED",
    },
  });

  return new ApiResponse(200, "Project deployment started successfully", {
    projectId,
    deploymentId: newDeployment.id,
    deployedUrl,
  });
};

export { createProject, checkStatus, deleteProject, redeploy };
