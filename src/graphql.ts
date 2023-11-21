import { ApolloServer } from "apollo-server-express";
import { NonEmptyArray, buildSchema } from "type-graphql";
import { Container } from "typedi";
import * as _ from "lodash";

import { Config } from "./config";
import { Express } from "express";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import type http from "http";
import { authMiddlewareForGraphql } from "./middleware/auth";
import { customAuthChecker } from "./auth/authChecker";

const context = ({ req, connection }: { req: any; connection: any }) => {
  if (connection) {
    return connection.context;
  }

  return {
    user: _.get(req, "user"),
  };
};

export const initGraphql = async (app: Express) => {
  let resolversPattern: NonEmptyArray<string> = [
    `${__dirname}/resolvers/*.resolver.js`,
  ];

  console.log("==========------------------");
  console.log(__dirname);
  console.log("Config.isProduction", Config.isProduction);
  console.log("Config.isStaging", Config.isStaging);

  if (!Config.isProduction && !Config.isStaging) {
    resolversPattern = [`${__dirname}/resolvers/*.resolver.ts`];
  }

  console.log("resolversPattern=======================");
  console.log(resolversPattern);
  const schema = await buildSchema({
    resolvers: resolversPattern,
    authChecker: customAuthChecker,
    container: Container,
  });

  const server = new ApolloServer({
    schema,
    context,
    plugins: [],
  });

  await server.start();

  app.use("/graphql", authMiddlewareForGraphql);

  server.applyMiddleware({ app });
};
