import * as core from '@actions/core';
import * as github from '@actions/github';
import * as exec from '@actions/exec';
import * as path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

async function run(): Promise<void> {
  try {
    const cleverTools = path.join(__dirname, '..', 'node_modules', '.bin', 'clever');
    // Get inputs
    const appType = core.getInput('type', { required: true });
    const setEnv = core.getInput('set-env') === 'true';
    const region = core.getInput('region');
    const domain = core.getInput('domain');
    const name = core.getInput('name');
    const alias = core.getInput('alias');

    // Get PR details
    const { pull_request } = github.context.payload;
    const prNumber = pull_request?.number;
    const repoName = github.context.repo.repo;

    if (!prNumber) {
      throw new Error('This action can only be run on pull requests');
    }

    // Execute clever-tools commands
    await exec.exec(cleverTools, ['login', '--token', process.env.CLEVER_TOKEN!, '--secret', process.env.CLEVER_SECRET!]);
    await exec.exec(cleverTools, ['create', name, '--type', appType, '--region', region, '--org', process.env.ORGA_ID!]);
    await exec.exec(cleverTools, ['domain', 'add', domain]);
    await exec.exec(cleverTools, ['alias', alias]);

    if (setEnv) {
      // Set environment variables
      Object.keys(process.env).forEach(key => {
        if (key.startsWith('GH_')) {
          const envVarName = key.slice(3);
          exec.exec(cleverTools, ['env', 'set', envVarName, process.env[key]!]);
        }
      });
    }

    // Deploy the app
    await exec.exec(cleverTools, ['deploy', '--force']);

    // Post comment with review app link
    const octokit = github.getOctokit(process.env.GITHUB_TOKEN!);
    await octokit.rest.issues.createComment({
      ...github.context.repo,
      issue_number: prNumber,
      body: `Review app deployed: https://${domain}`
    });

    core.setOutput('app_url', `https://${domain}`);
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      core.setFailed('An unknown error occurred');
    }
  }
}

run();
