"use strict";
import H from "highland"
import errors from "../../../lib/errors";
import customError from "../../../lib/errors/custom-error";
import { comparePassword, generateJwt } from "../../../lib/utils";
import userService from "../../users";
import agentService from "../../agents";
import { Agent } from "../../../models/businesses/types";
import config from "../../../config";



export default async function verifyCode(payload) {
  console.log(payload)
  const user = await userService().getByEmail(payload.email);




  const isVerificationCodeCorrect = await comparePassword(
    user.verification_code,
    payload.verification_code
  );
  if (!isVerificationCodeCorrect) {
    throw customError({
      name: errors.InvalidVerificationCode,
      message: "Verification code is not correct",
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
    redirect_url: `${config.DASHBOARD_URL}/api/auth?token=${generateJwt({
      business_id: userAgents[0].business,
      user_id: user.id

    })}&business_id=${userAgents[0].business}&user_id=${user.id}` 

  };

}
