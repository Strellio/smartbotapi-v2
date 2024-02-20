"use strict";
import { CHAT_PLATFORMS } from "../chat-platforms/schema";
import { PlanDuration } from "./schema";

const PLANS = [
  // {
  //   name: 'free',
  //   display_name: 'Free',
  //   price: 0,
  //   icon_class: 'bx bx-car',
  //   duration: PlanDuration.MONTHLY,
  //   free_trial_days: 14,
  //   display_features:[""],
  //   features: {
  //     allowed_live_support: true,
  //     allowed_external_platforms: [CHAT_PLATFORMS.FACEBOOK]
  //   }
  // },
  {
    name: "starter",
    display_name: "Starter",
    price: 39.99,
    icon_class: "bx bx-car",
    duration: PlanDuration.MONTHLY,
    display_features: [
      "Full access to smartbot",
      "Live chat support",
      "Connect with SmartChat, Intercom or HubSpot",
      "Maximum of 2 live agents",
      "Customize chat to suit your brand",
    ],

    free_trial_days: 14,
    features: {
      allowed_external_platforms: [
        CHAT_PLATFORMS.CUSTOM,
        CHAT_PLATFORMS.INTERCOM,
        CHAT_PLATFORMS.HUBSPOT,
      ],
      allowed_live_support: true,
      max_number_of_live_agent: 2,
      customize_chat: true,
      remove_smartbot_brand: false,
    },
  },
  {
    name: "pro",
    display_name: "Pro",
    price: 49.99,
    duration: PlanDuration.MONTHLY,
    free_trial_days: 14,
    icon_class: "bx bx-car",
    display_features: [
      "All Starter features, plus:",
      "Connect with Facebook messenger",
      "Maximum of 10 live agents",
    ],
    features: {
      allowed_external_platforms: [
        CHAT_PLATFORMS.CUSTOM,
        CHAT_PLATFORMS.INTERCOM,
        CHAT_PLATFORMS.HUBSPOT,
        CHAT_PLATFORMS.FACEBOOK,
        CHAT_PLATFORMS.INSTAGRAM,
      ],
      allowed_live_support: true,
      max_number_of_live_agent: 10,
      customize_chat: true,
      remove_smartbot_brand: false,
    },
  },
  {
    name: "premium",
    display_name: "Premium",
    price: 69.99,
    display_features: [
      "All Pro features, plus:",
      "Unlimited number of live agents",
      "Remove SmartBot label from chat widget",
      "Premium customer support",
    ],
    duration: PlanDuration.MONTHLY,
    free_trial_days: 14,
    icon_class: "bx bx-car",
    features: {
      allowed_external_platforms: [
        CHAT_PLATFORMS.CUSTOM,
        CHAT_PLATFORMS.INTERCOM,
        CHAT_PLATFORMS.HUBSPOT,
        CHAT_PLATFORMS.FACEBOOK,
        CHAT_PLATFORMS.INSTAGRAM,
      ],
      allowed_live_support: true,
      max_number_of_live_agent: "unlimited",
      customize_chat: true,
      remove_smartbot_brand: true,
    },
  },
];

export default PLANS;
