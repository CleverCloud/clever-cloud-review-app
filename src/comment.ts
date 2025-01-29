import * as core from '@actions/core'
import * as github from '@actions/github'
import * as utils from './utils'


export interface Inputs {
    token: string
    repository: string
    prNumber: number
    commentId: number
    body: string
    bodyPath: string
    editMode: string
    appendSeparator: string
//    reactions: string[]
//    reactionsEditMode: string
  }

//function appendSeparatorTo(body: string, separator: string): string {
//    switch (separator) {
//    case 'newline':
//    return body + '\n'
//    case 'space':
//    return body + ' '
//    default: // none
//    return body
//    }
//  }
  
  function truncateBody(body: string) {
    // 65536 characters is the maximum allowed for issue comments.
    const truncateWarning = '...*[Comment body truncated]*'
    if (body.length > 65536) {
      core.warning(`Comment body is too long. Truncating to 65536 characters.`)
      return body.substring(0, 65536 - truncateWarning.length) + truncateWarning
    }
    return body
  }

  async function createComment(
    octokit,
    owner: string,
    repo: string,
    prNumber: number,
    body: string
  ): Promise<number> {
    body = truncateBody(body)
  
    const {data: comment} = await octokit.rest.issues.createComment({
      owner: owner,
      repo: repo,
      pr_number: prNumber,
      body
    })
    core.info(`Created comment id '${comment.id}' on issue '${prNumber}'.`)
    return comment.id
  }

  async function getAuthenticatedUser(octokit): Promise<string> {
    try {
      const {data: user} = await octokit.rest.users.getAuthenticated()
      return user.login
    } catch (error) {
      if (
        utils
          .getErrorMessage(error)
          .includes('Resource not accessible by integration')
      ) {
        // In this case we can assume the token is the default GITHUB_TOKEN and
        // therefore the user is 'github-actions[bot]'.
        return 'github-actions[bot]'
      } else {
        throw error
      }
    }
  }
  export async function createOrUpdateComment(
    inputs: Inputs,
    body: string
  ): Promise<void> {
    const [owner, repo] = inputs.repository.split('/')
  
    const octokit = github.getOctokit(inputs.token)
  
    const commentId = inputs.commentId
//      ? await updateComment(
//          octokit,
//          owner,
//          repo,
//          inputs.commentId,
//          body,
//          inputs.editMode,
//          inputs.appendSeparator
//        ):
//      
         await createComment(octokit, owner, repo, inputs.prNumber, body)
  
    core.setOutput('comment-id', commentId)
    
  
//async function run() {
//    try {
//        const token = core.getInput('github_token');
//        const octokit = getOctokit(token);
//        const { owner, repo } = context.repo;
//        const issue_number = context.issue.number;
//
//        const comment = `This is a comment from my TypeScript action!`;
//        
//        await octokit.rest.issues.createComment({
//            owner,
//            repo,
//            issue_number,
//            body: comment,
//        });
//
//        console.log('Comment added successfully!');
//    } catch (error) {
//        if (error instanceof Error) {
//            core.setFailed(`Action failed with error: ${error.message}`);
//        }
//    }
}

//run();

