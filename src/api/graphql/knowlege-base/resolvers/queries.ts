'use strict'
import knowledegeBaseService from '../../../../services/knowlege-base'
export default {
  Query: {
    getKnowlegeBase: (parent: any, { input }: any, { business }: any) => {
      return knowledegeBaseService.get({
        query: {
        business: business.id,
      }})
    }
  }
}
