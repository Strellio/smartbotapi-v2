import { PubsubMessage } from '@google-cloud/pubsub/build/src/publisher'
import { parseString } from '../../../lib/utils'
import logger from '../../../lib/logger'
import { getDomainFromAttributes, getTopicFromAttributes } from './get-attributes'
import businessService from '../../../services/businesses'


export default async function handleEvent(
    event: PubsubMessage & {
        ack: Function
    }
) {
    const data = parseString(event.data as any)
    logger().info(
        'New Event' + JSON.stringify(data),
        +' ' + getTopicFromAttributes({ attributes: (event as any).attributes })
    )
  
    const eventName =
        event.attributes && getTopicFromAttributes({ attributes: event.attributes })
  
    const business = await businessService().getByExternalPlatformDomain(getDomainFromAttributes({
        attributes: event.attributes as never
    }))
    

}