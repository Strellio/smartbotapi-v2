"use strict";
import { required, decodeJwt } from "../../lib/utils";
import customError from "../../lib/errors/custom-error";
import businessService from "../../services/businesses";
import agentService from "../../services/agents"

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
    console.log(decoded)
    const [business, agent] = await Promise.all([businessService().getById(decoded.business_id), agentService.getByBusinessAndUserId({ userId: decoded.user_id, businessId: decoded.business_id })])
    return {
      business,
      agent,
      ...req,
    };
  } catch (error) {
    console.log(error);
    throw throwAuthError();
  }
}
