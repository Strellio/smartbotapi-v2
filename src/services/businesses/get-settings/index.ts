'use strict'

import { required } from "../../../lib/utils";
import businessModel from '../../../models/businesses'
import { STATUS_MAP } from "../../../models/common";
import { CHAT_TYPE } from "../../../models/chat-platforms/schema";









export default async function getSettings(businessId:string=required("businessId")){
    const business = await businessModel().getById(businessId)    
    return business.chat_platforms.find(chatPlatform=>{
        return chatPlatform.status === STATUS_MAP.ACTIVE && [CHAT_TYPE.BOTH, CHAT_TYPE.ON_SITE].includes(chatPlatform.type)
    })
}