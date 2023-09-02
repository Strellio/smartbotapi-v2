"use strict";
import errors from "../../../lib/errors";
import customError from "../../../lib/errors/custom-error";
import { comparePassword, generateJwt } from "../../../lib/utils";
import userService from "../../users";

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
  return {
    user,
    token: generateJwt({
      business_id: user?.businesses[0]?.id,
    }),
  };
}
