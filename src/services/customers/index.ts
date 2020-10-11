'use strict'

import createOrUpdate from './create-or-update'
import customerModel from '../../models/customers'

const listByBusinessId = customerModel().fetchByBusinessId
const getCustomer = customerModel().ensureExists
const getById = customerModel().getById
export { createOrUpdate, listByBusinessId, getCustomer, getById }
