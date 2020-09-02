
'use strict'
import agentService from '../../../../services/agents'
import H from 'highland'

export default {
    Query: {
        listAgents: (parent: any, { input }: any, { business }: any) => {
            return H(agentService.listByBusinessId(business.id)).collect().toPromise(Promise)
        }
    }
}
