'use strict'

import create from './create'
import agentsModel from "../../models/agents";



export default {
    create,
    listByBusinessId: agentsModel.listByBusinessId
}