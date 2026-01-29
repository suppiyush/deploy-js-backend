export const checkRepoExists = async (gitRepoUrl: string): Promise<boolean> => {
  const url = new URL(gitRepoUrl);
  const [owner, rawRepo] = url.pathname.split("/").filter(Boolean);
  const repo = rawRepo.replace(/\.git$/, "");

  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
    headers: {
      Accept: "application/vnd.github+json",
    },
  });

  return res.status === 200;
};
