"use strict";

import createOrUpdate from "./create-or-update";
import update from "./update";
import customerModel from "../../models/customers";

const listByBusinessId = customerModel().fetchByBusinessId;
const getCustomer = customerModel().ensureExists;
const getById = customerModel().getById;
const create = customerModel().create;
const getByExternalId = ({
  externalId,
  source,
}: {
  externalId: string;
  source: string;
}) => {
  return customerModel().get({
    query: {
      external_id: externalId,
      source,
    },
  });
};

export {
  createOrUpdate,
  listByBusinessId,
  getCustomer,
  getById,
  update,
  getByExternalId,
  create,
};
