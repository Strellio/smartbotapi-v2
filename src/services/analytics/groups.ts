'use strict'
import customersModel from '../../models/customers'
import messagesModel from '../../models/messages'
import moment from 'moment'

const customersByChatPlatform = ({
  fromDate,
  toDate,
  businessId
}: {
  fromDate?: Date
  toDate?: Date
  businessId: string
}) => customersModel().aggregateGroupByPlatform(businessId, fromDate, toDate)

const computeEngagementScore = async (
  businessId: string,
  fromDate: Date,
  toDate: Date
) => {
  const [totalMessages, totalReplies] = await Promise.all([
    messagesModel().countByBusinessId(businessId, {
      created_at: { $gte: fromDate, $lte: toDate }
    }),
    messagesModel().countByBusinessId(businessId, {
      created_at: { $gte: fromDate, $lte: toDate },
      is_message_from_customer: false
    })
  ])

  const score = (totalReplies / totalMessages) * 100 || 0

  return {
    total_messages: totalMessages,
    total_replies: totalReplies,
    engagement_score: parseFloat(score.toFixed(2))
  }
}

const engagementPerMonth = async (businessId: string) => {
  const [currentEngagement, previousEngagement] = await Promise.all([
    computeEngagementScore(
      businessId,
      moment()
        .startOf('month')
        .toDate(),
      moment()
        .endOf('month')
        .toDate()
    ),
    computeEngagementScore(
      businessId,
      moment()
        .subtract(1, 'months')
        .startOf('month')
        .toDate(),
      moment()
        .subtract(1, 'months')
        .endOf('month')
        .toDate()
    )
  ])

  const numerator =
    currentEngagement.engagement_score - previousEngagement.engagement_score
  const denomirator =
    currentEngagement.engagement_score + previousEngagement.engagement_score
  const performance = (
    (numerator / (denomirator > 0 ? denomirator : 1)) *
    100
  ).toFixed(2)

  return {
    current_engagement: currentEngagement,
    previous_engagement: previousEngagement,
    performance: performance
  }
}

const messagesByCreatedAt = ({
  fromDate,
  toDate,
  businessId
}: {
  fromDate?: Date
  toDate?: Date
  businessId: string
}) => messagesModel().aggregateGroupByCreatedAt(businessId, fromDate, toDate)

export { customersByChatPlatform, engagementPerMonth, messagesByCreatedAt }
