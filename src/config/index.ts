"use strict";
import * as envalid from "envalid";

require("dotenv").config();
const config = envalid.cleanEnv(
  process.env,
  {
    PORT: envalid.port(),
    DB_URL: envalid.url(),
    ATLAS_DB_URL: envalid.url(),
    SHOPIFY_APP_SECRET: envalid.str(),
    SHOPIFY_APP_KEY: envalid.str(),
    APP_URL: envalid.str(),
    DASHBOARD_URL: envalid.url(),
    FB_CLIENT_SECRET: envalid.str(),
    FB_CLIENT_ID: envalid.str(),
    FB_VALIDATION_TOKEN: envalid.str(),
    INTERCOM_CLIENT_ID: envalid.str(),
    INTERCOM_CLIENT_SECRET: envalid.str(),
    APP_KEY: envalid.str(),
    WIDGET_URL: envalid.url(),
    BOT_API: envalid.url(),
    REDIS_URL: envalid.url(),
    NEW_ADMIN_MESSAGE_TOPIC: envalid.str({
      default: `${process.env.NODE_ENV.toUpperCase()}-NEW_ADMIN_MESSAGE_TOPIC`,
    }),
    NEW_CUSTOMER_MESSAGE_TOPIC: envalid.str({
      default: `${process.env.NODE_ENV.toUpperCase()}-NEW_CUSTOMER_MESSAGE_TOPIC`,
    }),
    FLUTTERWAVE_SEC_KEY: envalid.str(),
    OPENAI_API_KEY: envalid.str(),
    MONGODB_PUBLIC_KEY: envalid.str(),
    MONGODB_PRIVATE_KEY: envalid.str(),
    MONGODB_PROJECT_ID: envalid.str(),
    MONGODB_CLUSTER_NAME: envalid.str(),
    IS_TS_RUNTIME: envalid.bool({
      default: false,
    }),
    IMAGES_BUCKET_NAME: envalid.str({
      default: "smartbot-assets",
    }),
    GOOGLE_CLOUD_PROJECT: envalid.str(),
    GOOGLE_APPLICATION_CREDENTIALS: envalid.str(),
    SHOPIFY_GOOGLE_PUB_SUB_TOPIC: envalid.str({
      default: `${process.env.NODE_ENV.toUpperCase()}-SHOPIFY-UPDATES`,
    }),
    EMAIL_SMTP_HOST: envalid.str(),
    EMAIL_SMTP_PORT: envalid.port(),
    EMAIL_SMTP_PASSWORD: envalid.str(),
    WEBHOOK_URL: envalid.str(),
  },
  {
    reporter: ({ errors }) => {
      for (const [envVar, err] of Object.entries(errors)) {
        if (err instanceof envalid.EnvError) {
          throw new Error(`${err.message} ${envVar}`);
        } else if (err instanceof envalid.EnvMissingError) {
          throw new Error(`No Env value set for ${envVar}`);
        } else {
          throw new Error(`${err.message} ${envVar}`);
        }
      }
    },
  }
);

export default {
  ...config,
  SHOPIFY_GOOGLE_PUB_SUB_SUBSCRIPTION_NAME: `projects/${config.GOOGLE_CLOUD_PROJECT}/subscriptions/${config.SHOPIFY_GOOGLE_PUB_SUB_TOPIC}-sub`,
  isProduction: process.env.NODE_ENV === "production",
  isTest: process.env.NODE_ENV === "test",
};
