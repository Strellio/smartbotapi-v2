import { CHAT_PLATFORMS } from "../chat-platforms/schema";
import { PlanDuration } from "./schema";

export type PlanFeatures = {
  allowed_external_platforms: CHAT_PLATFORMS[];
  allowed_live_support: boolean;
  max_number_of_live_agent: "unlimited" | number;
  customize_chat: boolean;
  remove_smartbot_brand: boolean;
  // Add other features as required
};

export type Plan = {
  name: string;
  display_name: string;
  price: number;
  display_features: string[];
  duration: PlanDuration;
  free_trial_days: number;
  icon_class: string;
  features: PlanFeatures;
};
