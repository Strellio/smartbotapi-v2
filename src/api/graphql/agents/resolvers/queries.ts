
'use strict'
import agentService from '../../../../services/agents'
import H from 'highland'

export default {
    Query: {
        listAgents: async (parent: any, { input }: any, { business }: any) => {
            console.log('hbhhhb');

            const age = await H(agentService.listByBusinessId(business.id)).collect().toPromise(Promise)
            console.log(age)
            return age
        }
    }
}
