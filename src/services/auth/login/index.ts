"use strict";
import H from "highland"
import errors from "../../../lib/errors";
import customError from "../../../lib/errors/custom-error";
import { comparePassword, generateJwt } from "../../../lib/utils";
import UserModdel from "../../../models/users";
import userService from "../../users";
import agentService from "../../agents";
import { Agent, Business } from "../../../models/businesses/types";
import nano from 'nanoid'
import { EMAIL_TEMPLATES } from "../../emails/types";
import sendEmail from "../../emails";
const nanoid =nano.customAlphabet('1234567890', 10)


export default async function login(payload) {
  const user = await userService().getByEmail(payload.email);

  const verificationCode = nanoid(6)


 await UserModdel().updateOne({ query: { _id: user.id }, update: { verification_code: verificationCode, verification_code_expires_at: new Date(Date.now() + 1800000) } })


 sendEmail({
  to: user.email,
  template: EMAIL_TEMPLATES.LOGIN,
  metadata: {
    email: user.email,
    loginCode: verificationCode
  }
})

  return "A verification code has been sent to your email address"
}
