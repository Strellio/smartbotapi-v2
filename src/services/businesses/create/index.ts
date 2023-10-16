"use strict";
import BusinessModel from "../../../models/businesses";
import schema from "./schema";
import { Business } from "../../../models/businesses/types";
import { validate } from "../../../lib/utils";
import errors from "../../../lib/errors";
import userService from "../../users";
import agentService from "../../agents";
import queues from "../../../lib/queues";
import { createSearchIndex } from "../../../lib/db/atlas";
import logger from "../../../lib/logger";

interface CreateBusinessParams {
  domain: string;
  email: string;
  status: string;
  external_id: string;
  business_name: string;
  shop: {
    external_created_at?: string;
    external_updated_at?: string;
    external_platform_domain: string;
    external_access_token?: string;
    external_refresh_token?: string;
    money_format?: string;
    external_platform_secret?: string;
    external_platform_client?: string;
  };
  full_name?: string;
  location?: {
    country: string;
    city: string;
  };
}

const ensureBusinessDoesNotExist = async (externalPlatformDomain: string) => {
  const business = await BusinessModel().getByExternalPlatformDomain(
    externalPlatformDomain
  );
  if (business) {
    throw errors.throwError({
      name: errors.ResourceAlreadyExists,
      message: "business already exists",
    });
  }
};

export default async function create(
  params: CreateBusinessParams
): Promise<Business> {
  validate(schema, params);
  await ensureBusinessDoesNotExist(params.shop.external_platform_domain);

  const user = await userService().updateOrCreate({
    email: params.email,
    full_name: params.full_name,
    country: params.location?.country,
  });

  const business = await BusinessModel().create({
    data: {
      ...params,
      account_name: params.business_name.replace(" ", "-").toLocaleLowerCase(),
      user: user.id,
    },
  });

  await agentService.create({
    email: params.email,
    name: params.full_name,
    country: params.location?.country,
    business_id: business.id,
    is_person: true,
  });

  const productSyncQueue = queues.productSyncQueue();
  const orderSyncQueue = queues.orderSyncQueue();

  await Promise.all([
    productSyncQueue.add({ data: { business }, jobId: business.id }),
    orderSyncQueue.add({ data: { business }, jobId: business.id }),
  ]).catch((err) => {
    logger().info("error while adding to queue");
    logger().error(err);
  });

  logger().info("queue added for ", business.business_name);

  return business;
}
