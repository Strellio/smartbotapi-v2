"use strict";
import updateById from "./update-by-id";
import create from "./create";
import businessModel from "../../models/businesses";
import ApiKeysModel from "../../models/auth";
import getSettings from "./get-settings";
import deleteBusiness from "./delete";
import H from "highland";

export default function businessService() {
  return {
    create,
    updateById,
    getByEmail: businessModel().getByEmail,
    getByExternalPlatformDomain: businessModel().getByExternalPlatformDomain,
    getById: businessModel().getById,
    getSettings,
    delete: deleteBusiness,
    getApiKeys(business: string) {
      return H(
        ApiKeysModel().fetch({
          query: {
            business,
          },
        })
      )
        .collect()
        .toPromise(Promise);
    },
  };
}
