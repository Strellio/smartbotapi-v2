"use strict";
import path from "path";
import cors from "cors";
import express from "express";
import { formatError } from "apollo-errors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import http from "http";
import { schemas, resolvers } from "./graphql";
import routes from "./routes";
import config from "../config";
import loggerMaker from "../lib/logger";
import isAuthenticated from "./middlewares/is-authenticated";
import logger from "../lib/logger";
import attachIpToReq from "./middlewares/attach-ip";
import { makeExecutableSchema } from "graphql-tools";

import { BullMonitorExpress } from "@bull-monitor/express";
import { BullMQAdapter } from "@bull-monitor/root/dist/bullmq-adapter";
import { Queue } from "bullmq";
import { BULL_QUEUES_NAMES, ioredis } from "../lib/queues";

const PORT = config.PORT;

const reqLogger = require("express-pino-logger")({
  logger: loggerMaker(),
});

const serveBullDashboard = () => async (req, res, next) => {
  const monitor = new BullMonitorExpress({
    queues: Object.values(BULL_QUEUES_NAMES).map(
      (name) =>
        new BullMQAdapter(
          new Queue(name, {
            connection: ioredis,
          })
        )
    ),
    gqlIntrospection: !config.isProd,
  });
  await monitor.init();
  return monitor.router(req, res, next);
};

const app = express();
const httpServer = http.createServer(app);

const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/graphql",
});

const getContext = async (ctx, msg, args) => {
  return { business: ctx.business, agent:ctx.agent };
};

const schema = makeExecutableSchema({ typeDefs: schemas, resolvers });

const serverCleanup = useServer(
  {
    schema: schema,
    onConnect: async (ctx: any) => {
      logger().info("connection established", ctx.connectionParams);

      let token;

      const headers = ctx.connectionParams.headers?? ctx.connectionParams;

      if (headers) {
        const authToken = headers["Authorization"] ?? headers["authorization"];

        token = authToken.split(" ")[1];
      }
      const { business, agent } = await isAuthenticated(token, ctx);

      ctx.business = business;
      ctx.agent = agent
    },
    onDisconnect: (ctx) => {
      logger().error("Connection disconnected", ctx.connectionParams);
    },
    context: getContext,
  },
  wsServer
);

const graphqlServer = new ApolloServer({
  typeDefs: schemas,
  resolvers,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
  formatError: (error) => {
    console.log(error);

    return formatError(error) as any;
  },
  introspection: config.isDev,
  csrfPrevention: true,
  logger: logger(),
});

export default async function startServer() {
  await graphqlServer.start();
  app
    .use(cors())
    .use("/static", express.static(path.join(__dirname, "../public")))
    .use(express.json())
    .use(express.urlencoded({ extended: false }))
    .use(attachIpToReq)
    .use(reqLogger)
    .use(routes())
    .use("/queues", serveBullDashboard())
    .use(
      "/graphql",
      // @ts-ignore
      expressMiddleware(graphqlServer, {
        context: async ({ req }) => {
          const token = req.headers.authorization?.split("Bearer ")[1];
          const operationsToIgnore = ["createAccount", "login"];
          if (operationsToIgnore.includes(req.body.operationName)) return req;
          const result = await isAuthenticated(token, req);
          return result;
        },
      })
    );

  httpServer.listen(PORT, () => {
    loggerMaker().info(`Server started on http://localhost:${PORT}`);
    loggerMaker().info(
      `🚀 Subscriptions ready at ws://localhost:${PORT}/graphql}`
    );
  });
}
