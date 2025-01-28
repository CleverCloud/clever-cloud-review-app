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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const exec = __importStar(require("@actions/exec"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Get inputs
            const appType = core.getInput('type', { required: true });
            const setEnv = core.getInput('set-env') === 'true';
            const region = core.getInput('region');
            const domain = core.getInput('domain');
            const name = core.getInput('name');
            const alias = core.getInput('alias');
            // Get PR details
            const { pull_request } = github.context.payload;
            const prNumber = pull_request === null || pull_request === void 0 ? void 0 : pull_request.number;
            const repoName = github.context.repo.repo;
            if (!prNumber) {
                throw new Error('This action can only be run on pull requests');
            }
            // Execute clever-tools commands
            yield exec.exec('clever', ['login', '--token', process.env.CLEVER_TOKEN, '--secret', process.env.CLEVER_SECRET]);
            yield exec.exec('clever', ['create', name, '--type', appType, '--region', region, '--org', process.env.ORGA_ID]);
            yield exec.exec('clever', ['domain', 'add', domain]);
            yield exec.exec('clever', ['alias', alias]);
            if (setEnv) {
                // Set environment variables
                Object.keys(process.env).forEach(key => {
                    if (key.startsWith('GH_')) {
                        const envVarName = key.slice(3);
                        exec.exec('clever', ['env', 'set', envVarName, process.env[key]]);
                    }
                });
            }
            // Deploy the app
            yield exec.exec('clever', ['deploy', '--force']);
            // Post comment with review app link
            const octokit = github.getOctokit(process.env.GITHUB_TOKEN);
            yield octokit.rest.issues.createComment(Object.assign(Object.assign({}, github.context.repo), { issue_number: prNumber, body: `Review app deployed: https://${domain}` }));
            core.setOutput('app_url', `https://${domain}`);
        }
        catch (error) {
            if (error instanceof Error) {
                core.setFailed(error.message);
            }
            else {
                core.setFailed('An unknown error occurred');
            }
        }
    });
}
run();
