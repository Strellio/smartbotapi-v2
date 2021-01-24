'use strict'
import { CHAT_PLATFORMS } from '../chat-platforms/schema'
import { PlanDuration } from './schema'

const PLANS = [
  {
    name: 'free',
    display_name: 'Free',
    price: 0,
    icon_class: 'bx bx-car',
    duration: PlanDuration.MONTHLY,
    free_trial_days: 30,
    features: {
      allowed_live_support: true,
      allowed_external_platforms: [CHAT_PLATFORMS.FACEBOOK]
    }
  },
  {
    name: 'starter',
    display_name: 'Starter',
    price: 10.99,
    icon_class: 'bx bx-car',
    duration: PlanDuration.MONTHLY,
    free_trial_days: 30,
    features: {
      allowed_external_platforms: [
        CHAT_PLATFORMS.INTERCOM,
        CHAT_PLATFORMS.HUBSPOT
      ],
      allowed_live_support: true
    }
  },
  {
    name: 'pro',
    display_name: 'Pro',
    price: 14.99,
    duration: PlanDuration.MONTHLY,
    free_trial_days: 30,
    icon_class: 'bx bx-car',
    features: {
      allowed_external_platforms: [
        CHAT_PLATFORMS.FACEBOOK,
        CHAT_PLATFORMS.INTERCOM,
        CHAT_PLATFORMS.HUBSPOT
      ],
      allowed_live_support: true
    }
  },
  {
    name: 'premium',
    display_name: 'Premium',
    price: 19.99,
    duration: PlanDuration.MONTHLY,
    free_trial_days: 30,
    icon_class: 'bx bx-car',
    features: {
      allowed_external_platforms: Object.values(CHAT_PLATFORMS),
      allowed_live_support: true
    }
  }
]

export default PLANS
