'use strict'

import { required, decodeJwt } from "../../lib/utils";
import customError from "../../lib/errors/custom-error";
import businessService from '../../services/businesses'

const throwAuthError = () =>customError({
    name: "UnAuthorizedError",
    message: "you are not authorized to access this resource"
})

export default async function isAuthenticated(token:string =required("token")){
   try {
    const decoded:any = await decodeJwt(token)
    return {
        business: await businessService().getById(decoded.business_id)
    }
   } catch (error) {
    throw throwAuthError()
   }
}