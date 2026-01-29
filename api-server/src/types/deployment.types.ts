export enum projectStatus {
  DEPLOYED = "DEPLOYED",
  FAILED = "FAILED",
}

export interface CheckStatusData {
  userId: string;
  deploymentId: string;
}

export interface UpdateStatusData {
  deploymentId: string;
  status: projectStatus;
}
