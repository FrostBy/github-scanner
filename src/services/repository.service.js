import logger from "../logger.js";
import GithubService from './github.service.js';

class RepositoryService {
    static _decodeBase64Content(content) {
        return Buffer.from(content, 'base64').toString('utf-8');
    }

    static async getList(token) {
        try {
            const githubService = new GithubService(token);
            const list = await githubService.getRepositoryList(token);
            return list.map(repository => ({
                name: repository.name,
                size: repository.size,
                owner: repository.owner.login,
            }))
        } catch (error) {
            logger.error(`Error fetching repository list: ${error.message}`);
            throw error
        }
    }

    static async getDetails({token, repoName, userName}) {
        try {
            const githubService = new GithubService(token);
            const repo = await githubService.getRepository({token, repoName, userName})
            const [contents, hooks] = await Promise.all([
                githubService.getRepositoryContents({token, repoName, userName, branch: repo.default_branch}),
                githubService.getRepositoryHooks({token, repoName, userName}),
            ]);

            const ymlFile = contents.find(item => item.path.endsWith('.yml'));
            const contentYML = ymlFile
                ? this._decodeBase64Content(await githubService.getFileContent({
                    repoName,
                    userName,
                    filePath: ymlFile.path,
                    token
                })) : null;


            const activeWebhooks = hooks
                .filter(hook => hook.active)
                .map(hook => ({
                    url: hook.config.url,
                    name: hook.name,
                    events: hook.events
                }));

            return {
                name: repo.name,
                size: repo.size,
                owner: repo.owner.login,
                isPrivate: repo.private,
                fileCount: contents.length,
                contentYML,
                activeWebhooks,
            };
        } catch (error) {
            logger.error(`Error fetching details for repository "${repoName}": ${error.message}`);
            throw error
        }
    }
}

export default RepositoryService;
