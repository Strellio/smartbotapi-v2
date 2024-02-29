"use strict";
import express, { Request, Response, NextFunction } from "express";
import config from "../../config";
import loggerMaker from "../../lib/logger";
import routes from "./routes";
import cors from "cors";
import { IncomingMessage } from "http";

const app = express();

const PORT = config.PORT;

const reqLogger = require("express-pino-logger")({
  logger: loggerMaker(),
});

app
  .use(cors())
  .use(
    express.json({
      // Because Stripe needs the raw body, we compute it but only when hitting the Stripe callback URL.
      verify: (
        req: IncomingMessage & { rawBody?: string; originalUrl: string },
        res,
        buf
      ) => {
        if (req.originalUrl.includes("/webhooks/shopify")) {
          req.rawBody = buf.toString();
        }
      },
    })
  )
  .use(express.urlencoded({ extended: false }))
  .use(reqLogger)
  .use(
    "/webhooks",
    (req, res, next) => {
      console.log(req.body);
      next();
    },
    routes()
  )
  .use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(res);
    res.status?.(500).json({
      message: err.message,
    });
  })
  .listen(PORT, () => {
    loggerMaker().info(`Server started on http://localhost:${PORT}`);
  });
