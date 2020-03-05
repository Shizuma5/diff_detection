const core = require('@actions/core');
const github = require('@actions/github');

const getPullRequestNumber = () => {
  const pullRequest = github.context.payload.pull_request;
  if (!pullRequest) {
    return undefined;
  }

  return pullRequest.number;
};

const getPullRequestChangedFiles = async (octokit, pullNumber) => {
  const { data } = await octokit.pulls.listFiles({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    pull_number: pullNumber,
  });

  return data.map((v) => v.filename);
};

const run = async () => {
  try {
    const token = core.getInput('github-token');

    const pullRequestNumber = getPullRequestNumber();
    const octokit = new github.GitHub(token);

    const changeFiles = await getPullRequestChangedFiles(octokit, pullRequestNumber);
    print(changeFiles);
  } catch (error) {
    core.error(error);
    core.setFailed(error.message);
  }
};

run();
