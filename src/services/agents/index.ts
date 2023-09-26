'use strict'

import create from './create'
import update, {updateAvailability} from "./update"
import agentsModel from "../../models/agents";



export default {
    update,
    create,
    updateAvailability,
    listByBusinessId: agentsModel.listByBusinessId,
    getAgentById: agentsModel.getById,
    listByUserId: agentsModel.listByUserId,
    getByBusinessAndUserId: agentsModel.getByBusinessAndUserId,
    getBotAgent: agentsModel.getBotAgent
}