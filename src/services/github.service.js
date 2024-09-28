import { Octokit } from "@octokit/rest";
import logger from "../logger.js";

class GithubService {
    constructor(token) {
        this.octokit = new Octokit({auth: token});
    }

    async getRepositoryList() {
        try {
            const response = await this.octokit.repos.listForAuthenticatedUser();
            return response.data;
        } catch (error) {
            logger.error(`Error fetching repository list: ${error.message}`);
            throw error
        }
    }

    async getRepository({repoName, userName}) {
        try {
            const response = await this.octokit.repos.get({
                owner: userName,
                repo: repoName
            });
            return response.data;
        } catch (error) {
            logger.error(`Error fetching repository "${repoName}" for user "${userName}": ${error.message}`);
            throw error
        }
    }

    async getRepositoryContents({repoName, userName, branch}) {
        try {
            const response = await this.octokit.git.getTree({
                owner: userName,
                repo: repoName,
                tree_sha: branch || 'master',
                recursive: 1
            });
            return response.data.tree || [];
        } catch (error) {
            logger.error(`Error fetching contents for repository "${repoName}": ${error.message}`);
            throw error
        }
    }

    async getRepositoryHooks({repoName, userName}) {
        try {
            const response = await this.octokit.repos.listWebhooks({
                owner: userName,
                repo: repoName
            });
            return response.data;
        } catch (error) {
            logger.error(`Error fetching hooks for repository "${repoName}": ${error.message}`);
            throw error
        }
    }

    async getFileContent({repoName, userName, filePath}) {
        try {
            const response = await this.octokit.repos.getContent({
                owner: userName,
                repo: repoName,
                path: filePath,
            });

            if (Array.isArray(response.data)) {
                throw new Error('The specified path is a directory or contains multiple files.');
            }

            return response.data.content;
        } catch (error) {
            logger.error(`Error fetching file content from ${filePath} in repository "${repoName}": ${error.message}`);
            throw error
        }
    }
}

export default GithubService;
