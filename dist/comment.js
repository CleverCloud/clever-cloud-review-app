"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrUpdateComment = createOrUpdateComment;
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const utils = __importStar(require("./utils"));
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
function truncateBody(body) {
    // 65536 characters is the maximum allowed for issue comments.
    const truncateWarning = '...*[Comment body truncated]*';
    if (body.length > 65536) {
        core.warning(`Comment body is too long. Truncating to 65536 characters.`);
        return body.substring(0, 65536 - truncateWarning.length) + truncateWarning;
    }
    return body;
}
async function createComment(octokit, owner, repo, prNumber, body) {
    body = truncateBody(body);
    const { data: comment } = await octokit.rest.issues.createComment({
        owner: owner,
        repo: repo,
        pr_number: prNumber,
        body
    });
    core.info(`Created comment id '${comment.id}' on issue '${prNumber}'.`);
    return comment.id;
}
async function getAuthenticatedUser(octokit) {
    try {
        const { data: user } = await octokit.rest.users.getAuthenticated();
        return user.login;
    }
    catch (error) {
        if (utils
            .getErrorMessage(error)
            .includes('Resource not accessible by integration')) {
            // In this case we can assume the token is the default GITHUB_TOKEN and
            // therefore the user is 'github-actions[bot]'.
            return 'github-actions[bot]';
        }
        else {
            throw error;
        }
    }
}
async function createOrUpdateComment(inputs, body) {
    const [owner, repo] = inputs.repository.split('/');
    const octokit = github.getOctokit(inputs.token);
    const commentId = inputs.commentId;
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
    await createComment(octokit, owner, repo, inputs.prNumber, body);
    core.setOutput('comment-id', commentId);
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
