'use strict'

import create from './create'
import update from "./update"
import agentsModel from "../../models/agents";



export default {
    update,
    create,
    listByBusinessId: agentsModel.listByBusinessId,
    getAgentById: agentsModel.getById,
    listByUserId: agentsModel.listByUserId,
    getByBusinessAndUserId: agentsModel.getByBusinessAndUserId
}