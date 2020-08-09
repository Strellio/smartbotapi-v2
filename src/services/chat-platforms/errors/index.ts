'use strict'
import  errors from "../../../lib/errors";


export default {
    onlyOneChatPlatformCanBeOnSiteAndActiveError: (chatPlatformName:string)=>{
       return errors.throwError({
           name: errors.OnlyOneChatPlatformCanBeOnSiteAndActiveError,
           message: `You currently have ${chatPlatformName} as your onsite chat platform. To continue you need to deactivate it`
       })
    }
}