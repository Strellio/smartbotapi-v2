"use strict";
import H from "highland"
import errors from "../../../lib/errors";
import customError from "../../../lib/errors/custom-error";
import { comparePassword, generateJwt } from "../../../lib/utils";
import userService from "../../users";
import agentService from "../../agents";
import { Agent, Business } from "../../../models/businesses/types";


export default async function login(payload) {
  const user = await userService().getByEmail(payload.email);
  const isPasswordCorrect = await comparePassword(
    user.password,
    payload.password
  );
  if (!isPasswordCorrect) {
    throw customError({
      name: errors.InvalidPasswordOrEmailError,
      message: "password or email is not valid",
    });
  }


  const userAgents: Agent[] = await H(agentService.listByUserId(user.id)).collect().toPromise(Promise) as any

  if (userAgents.length === 0) {
    throw customError({
      name: errors.ValidationError,
      message: "No business is associated to your account",
    });
    
  }


  return {
    user,
    token: generateJwt({
      business_id: userAgents[0].business,
      user_id: user.id
    }),
  };
}
