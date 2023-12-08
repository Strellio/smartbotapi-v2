"use strict";
import businessService from "../../../../../services/businesses";
import gdrpService from "../../../../../services/gdpr";
import uninstall from "../common/uninstall";

export const handleGdpr = async ({ payload, type }) => {
  const business = await businessService().getByExternalPlatformDomain(
    `https://${payload.shop_domain}`
  );
  if (!business) throw new Error("Shop not found");

  return gdrpService.upsert({
    query: { business: business.id },
    create: { requests: [{ type, payload }], business: business.id },
    update: {
      $addToSet: { requests: { type, payload } },
      business: business.id,
    },
  });
};

export const handleUninstall = async (domain: string) => {
  await uninstall(domain);
};
