'use strict'
import config from '../../config'
import { GooglePubSub } from '@axelspringer/graphql-google-pubsub'
import { parseString } from '../utils'
import {redisPubSub} from "../redis"

// const pubsub = new GooglePubSub(
//   {
//     projectId: config.get('PUBSUB_PROJECT_ID'),
//     credentials: JSON.parse(config.get('PUBSUB_CREDENTIALS') as string)
//   },
//   topicName => `${topicName}-subscription`,
//   ({ data}) => {
//     return parseString(data.toString())
//   }
// )
// pubsub.publish("DEVELOPMENT_NEW_CHAT_MESSAGE", { message: "Hello world!" })
export default redisPubSub()
