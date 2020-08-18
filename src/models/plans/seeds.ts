'use strict'

const PLANS = [
  {
    name: 'free',
    display_name: 'Free',
    price: 0,
    icon_class:"bx bx-car",
    duration:"per month",
    free_trial_days: 30,
    features: []
  },
  {
    name: 'starter',
    display_name: 'Starter',
    price: 10.99,
    icon_class:"bx bx-car",
    duration:"per month",
    free_trial_days: 30,
    features: [ { title: "Free Live Support" },
    { title: "Access to intercom or hubSpot" },
    { title: "No Time Tracking" },
    { title: "Free Setup" }]
  },
  {
    name: 'pro',
    display_name: 'Pro',
    price: 14.99,
    duration:"per month",
    free_trial_days: 30,
    icon_class:"bx bx-car",
    features: [{ title: "Free Live Support" },
    { title: "Access to facebook, intercom or hubSpot" },
    { title: "No Time Tracking" },
    { title: "Free Setup" }]
  },
  {
    name: 'premium',
    display_name: 'Premium',
    price: 19.99,
    duration:"per month",
    free_trial_days: 30,
    icon_class:"bx bx-car",
    features: [{ title: "Free Live Support" },
    { title: "Access to our custom chat, intercom or hubSpot" },
    { title: "No Time Tracking" },
    { title: "Free Setup" }]
  }
]

export default PLANS
