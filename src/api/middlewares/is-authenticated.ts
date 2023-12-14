"use strict";
import { required, decodeJwt } from "../../lib/utils";
import customError from "../../lib/errors/custom-error";
import businessService from "../../services/businesses";
import agentService from "../../services/agents";
import logger from "../../lib/logger";
import { STATUS_MAP } from "../../models/common";
import { Agent } from "../../models/businesses/types";

const throwAuthError = () =>
  customError({
    name: "UnAuthenticatedError",
    message: "you are not authorized to access this resource",
  });

export default async function isAuthenticated(
  token: string = required("token"),
  req: object = {}
) {
  try {
    const decoded: any = await decodeJwt(token);
    const [business, agent] = await Promise.all([
      businessService().getById(decoded.business_id),
      agentService.getByBusinessAndUserId({
        userId: decoded.user_id,
        businessId: decoded.business_id,
      }) as Promise<any> as Promise<Agent>,
    ]);

    if (
      !business ||
      business.status !== STATUS_MAP.ACTIVE ||
      agent?.status !== STATUS_MAP.ACTIVE
    ) {
      throw throwAuthError();
    }
    return {
      business,
      agent,
      ...req,
    };
  } catch (error) {
    logger().error(error);
    throw throwAuthError();
  }
}
