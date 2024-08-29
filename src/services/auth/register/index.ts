"use strict";
import errors from "../../../lib/errors";
import customError from "../../../lib/errors/custom-error";
import { generateJwt } from "../../../lib/utils";
import businessModel from "../../../models/businesses";
import { PLATFORM_MAP } from "../../../models/businesses/schema/enums";
import userService from "../../users";

const ensureBusinessDoesNotExist = async (payload: any) => {
  const business = await businessModel().get({
    query: { $or: [{ email: payload.email }, { domain: payload.domain }] },
  });
  if (business) {
    throw customError({
      name: errors.ResourceAlreadyExists,
      message: "A business already exist with this domain or email",
    });
  }
};

export default async function register(payload: any) {
  await ensureBusinessDoesNotExist(payload);

  const user = await userService().createUser(payload);
  const business = await businessModel().create({
    data: {
      domain: payload.domain,
      user: user.id,
      is_external_platform: false,
      platform: PLATFORM_MAP.WEBSITE,
      business_name: payload.business_name,
      email: user.email,
      location: {
        country: payload.country,
        city: payload.city,
      },
    },
  });

  return {
    user: await userService().getById(user.id),
    token: generateJwt({
      business_id: business.id,
    }),
  };
}
