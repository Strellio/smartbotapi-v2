import { PLATFORM_MAP } from "./schema/enums";
import { CHAT_PLATFORMS, CHAT_TYPE } from "../chat-platforms/schema";
import { STATUS_MAP } from "../common";
import { User } from "../users/types";
import { Plan } from "../plans/types";
import { AGENT_AVAILABILTY_STATUS } from "../agents/schema";

export type Business = {
  id: string;
  domain: string;
  email: string;
  status: string;
  external_id: String;
  platform: PLATFORM_MAP;
  business_name: string;
  account_name: string;
  location: Location;
  trial_expiry_date: Date;
  date_upgraded: Date;
  shop: Shop;
  chat_platforms: [ChatPlatform];
  user: User | string;
  onboarding: Onboarding;
  plan: string | Plan;
};

export type ChatAgent = {
  id: string;
  external_id: string;
  name: string;
  profile_url: string;
  is_person: boolean;
  created_at: Date;
  updated_at: Date;
};

export type ChatPlatform = {
  id: string;
  platform: CHAT_PLATFORMS;
  external_id: string;
  agents: [ChatAgent];
  external_user_id: string;
  external_user_access_token: string;
  external_user_name: string;
  external_access_token: string;
  external_refresh_token: string;
  type: CHAT_TYPE;
  status: STATUS_MAP;
  business: Business;
  is_external_agent_supported: boolean;
};

export type Location = {
  country: String;
  city: String;
};

export type Shop = {
  id: string;
  external_created_at: Date;
  external_updated_at: Date;
  external_platform_domain: string;
  money_format: string;
  external_access_token: string;
  charge_id: string;
};

export type Agent = {
  id: string;
  user?: User;
  business: Business | string;
  bot_info?: {
    name: string;
    profile_url: string;
  };
  is_person: boolean;
  linked_chat_agents: [ChatAgent];
  status: STATUS_MAP;
  availability_status: AGENT_AVAILABILTY_STATUS;
  created_at: Date;
  updated_at: Date;
};

export type Onboarding = {
  is_product_index_created: boolean;
  is_order_index_created: boolean;
  is_knowledge_base_index_created: boolean;
  is_product_vector_store_created: boolean;
  is_order_vector_store_created: boolean;
  is_knowledge_base_vector_store_created: boolean;
};
