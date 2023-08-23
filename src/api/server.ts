"use strict";
import path from "path";
import cors from "cors"
import express from "express";
import { formatError } from "apollo-errors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import http from "http";
import { schemas, resolvers } from "./graphql";
import routes from "./routes";
import config from "../config";
import loggerMaker from "../lib/logger";
import isAuthenticated from "./middlewares/is-authenticated";
import logger from "../lib/logger";
import attachIpToReq from "./middlewares/attach-ip";

const PORT = config.PORT;

const reqLogger = require("express-pino-logger")({
  logger: loggerMaker(),
});

const app = express();
const httpServer = http.createServer(app);

const graphqlServer = new ApolloServer({
  typeDefs: schemas,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  formatError: formatError as any,
  introspection: config.isDev,
  csrfPrevention: true,
  // subscriptions: {
  //   onConnect: (connectionParams: any, websocket, context) => {
  //     logger().info("connection established", connectionParams);
  //     const token = connectionParams?.headers?.Authorization.split(" ")[1];
  //     return isAuthenticated(token);
  //   },
  //   onDisconnect: (websocket) => {
  //     logger().error("Connection disconnected", websocket);
  //   },
  // },
  logger: logger(),
});

export default async function startServer() {
  await graphqlServer.start();
  app.use(cors())
    .use("/static", express.static(path.join(__dirname, "../public")))
    .use(express.json())
    .use(express.urlencoded({ extended: false }))
    .use(attachIpToReq)
    .use(reqLogger)
    .use(routes())
    .use(
      "/graphql",
      expressMiddleware(graphqlServer, {
        context: async ({ req }) => {
          const token = req.headers.authorization?.split(" ")[1];
          const operationsToIgnore = ["createAccount", "login"];
          if (operationsToIgnore.includes(req.body.operationName)) return req;
          return isAuthenticated(token, req);
        },
      })
    );

  httpServer.listen(PORT, () => {
    loggerMaker().info(`Server started on http://localhost:${PORT}`);
    loggerMaker().info(
      `🚀 Subscriptions ready at ws://localhost:${PORT}${graphqlServer}`
    );
  });
}
