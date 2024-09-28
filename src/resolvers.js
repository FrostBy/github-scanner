import pLimit from 'p-limit';
import RepositoryService from './services/repository.service.js';
import logger from './logger.js';

const limit = pLimit(2);

export default {
    Query: {
        listRepositories: async (_, {token}) => {
            try {
                return await RepositoryService.getList(token);
            } catch (error) {
                logger.error(`Error fetching repositories: ${error.message}`);
                logger.error(error);
                throw new Error('Failed to fetch repositories');
            }
        },

        getRepositoryDetails: async (_, {token, repoName, userName}) => {
            try {
                return await limit(() =>
                    RepositoryService.getDetails({token, repoName, userName})
                );
            } catch (error) {
                logger.error(`Error fetching details for repository "${repoName}": ${error.message}`);
                logger.error(error);
                throw new Error('Failed to fetch repository details');
            }
        },
    },
};
