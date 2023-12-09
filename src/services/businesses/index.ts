"use strict";
import updateById from "./update-by-id";
import create from "./create";
import businessModel from "../../models/businesses";
import getSettings from "./get-settings";
import deleteBusiness from "./delete";

export default function businessService() {
  return {
    create,
    updateById,
    getByEmail: businessModel().getByEmail,
    getByExternalPlatformDomain: businessModel().getByExternalPlatformDomain,
    getById: businessModel().getById,
    getSettings,
    delete: deleteBusiness,
  };
}
