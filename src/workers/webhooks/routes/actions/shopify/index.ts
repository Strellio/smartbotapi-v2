'use strict'
import businessService from '../../../../../services/businesses'
import gdrpService from '../../../../../services/gdpr'


// const uninstall = require('../../common/uninstall')




// const uninstalledShop = (req, res, next) => uninstall(req.shop).catch(next)


export const handleGdpr = async ({ payload, type }) => {

  const business = await businessService().getByExternalPlatformDomain(`https://${payload.shop_domain}`)
if(!business) throw new Error('Shop not found')

 return gdrpService.upsert({
   query: { business: business.id },
   create: { requests: [{ type, payload }], business: business.id },
    update: { $addToSet: { requests: { type, payload } }, business: business.id }
  })
}




