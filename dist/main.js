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
const core = __importStar(require("@actions/core"));
const comment_1 = require("./comment");
const fs_1 = require("fs");
const util_1 = require("util");
const utils = __importStar(require("./utils"));
function getBody(inputs) {
    if (inputs.body) {
        return inputs.body;
    }
    else if (inputs.bodyPath) {
        return (0, fs_1.readFileSync)(inputs.bodyPath, 'utf-8');
    }
    else {
        return '';
    }
}
async function run() {
    try {
        const inputs = {
            token: core.getInput('token'),
            repository: core.getInput('repository'),
            prNumber: Number(core.getInput('pr-number')),
            commentId: Number(core.getInput('comment-id')),
            body: core.getInput('body'),
            bodyPath: core.getInput('body-path') || core.getInput('body-file'),
            editMode: core.getInput('edit-mode'),
            appendSeparator: core.getInput('append-separator')
            //      reactions: utils.getInputAsArray('reactions'),
            //      reactionsEditMode: core.getInput('reactions-edit-mode')
        };
        core.debug(`Inputs: ${(0, util_1.inspect)(inputs)}`);
        if (!['append', 'replace'].includes(inputs.editMode)) {
            throw new Error(`Invalid edit-mode '${inputs.editMode}'.`);
        }
        //    if (!['append', 'replace'].includes(inputs.reactionsEditMode)) {
        //      throw new Error(
        //        `Invalid reactions edit-mode '${inputs.reactionsEditMode}'.`
        //      )
        //    }
        if (!['newline', 'space', 'none'].includes(inputs.appendSeparator)) {
            throw new Error(`Invalid append-separator '${inputs.appendSeparator}'.`);
        }
        if (inputs.bodyPath && inputs.body) {
            throw new Error("Only one of 'body' or 'body-path' can be set.");
        }
        if (inputs.bodyPath) {
            if (!(0, fs_1.existsSync)(inputs.bodyPath)) {
                throw new Error(`File '${inputs.bodyPath}' does not exist.`);
            }
        }
        const body = getBody(inputs);
        if (inputs.commentId) {
            //      if (!body && !inputs.reactions) {
            if (!body) {
                throw new Error("Missing comment 'body', 'body-path'");
            }
        }
        else if (inputs.prNumber) {
            if (!body) {
                throw new Error("Missing comment 'body' or 'body-path'.");
            }
        }
        else {
            throw new Error("Missing either 'pr-number' or 'comment-id'.");
        }
        (0, comment_1.createOrUpdateComment)(inputs, body);
    }
    catch (error) {
        core.debug((0, util_1.inspect)(error));
        const errMsg = utils.getErrorMessage(error);
        core.setFailed(errMsg);
        if (errMsg == 'Resource not accessible by integration') {
            core.error(`See this action's readme for details about this error`);
        }
    }
}
run();
