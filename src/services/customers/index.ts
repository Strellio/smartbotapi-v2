'use strict'

import createOrUpdate from "./create-or-update";
import customerModel from "../../models/customers";


const listByBusinessId = customerModel().fetchByBusinessId

export {
    createOrUpdate,
    listByBusinessId
}