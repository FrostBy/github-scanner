import { readFileSync } from 'fs';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import resolvers from './src/resolvers.js';
import logger from './src/logger.js';

const typeDefs = readFileSync('./schemas/schema.graphql', {encoding: 'utf-8'});

const server = new ApolloServer({
    typeDefs, resolvers, formatError: (err) => {
        logger.error(err)

        return {
            message: err.message,
            path: err.path,
            extensions: {
                code: err.extensions.code,
            },
        };
    }
});

const {url} = await startStandaloneServer(server);
console.log(`🚀 Server ready at ${url}`);