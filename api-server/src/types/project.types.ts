export interface CreateProjectData {
  name: string;
  userId: string;
  gitRepoUrl: string;
  envObject: Record<string, string>;
}

export interface ProjectActionData {
  userId: string;
  projectId: string;
}
