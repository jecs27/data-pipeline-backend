import { Plugin } from '@nestjs/apollo';
import {
  ApolloServerPlugin,
  GraphQLRequestListener,
  GraphQLRequestContext,
} from '@apollo/server';
import { GraphQLError } from 'graphql';

const MAX_LIMIT = process.env.MAX_LIMIT ? parseInt(process.env.MAX_LIMIT) : 100;
const MIN_LIMIT = process.env.MIN_LIMIT ? parseInt(process.env.MIN_LIMIT) : 1;
const MIN_PAGE = process.env.MIN_PAGE ? parseInt(process.env.MIN_PAGE) : 1;

@Plugin()
export class ValidationPlugin implements ApolloServerPlugin {
  async requestDidStart(): Promise<GraphQLRequestListener<any>> {
    return {
      async willSendResponse(requestContext: GraphQLRequestContext<any>) {
        const { operation } = requestContext;
        if (!operation) return;

        const variables = requestContext.request.variables;
        if (variables) {
          if (
            variables.limit &&
            (variables.limit > MAX_LIMIT || variables.limit < MIN_LIMIT)
          ) {
            throw new GraphQLError(
              `Limit must be between ${MIN_LIMIT} and ${MAX_LIMIT}`,
            );
          }
          if (variables.page && variables.page < MIN_PAGE) {
            throw new GraphQLError(`Page must be greater than ${MIN_PAGE - 1}`);
          }
        }
      },
    };
  }
}
