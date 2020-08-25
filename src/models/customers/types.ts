import { Business, ChatPlatform } from "../businesses/types";

export type Customer = {
    business: Business
    external_id: string
    source: ChatPlatform
    email?: string
    name?: string
    profile_url?: string
    subscribed?: boolean
    locale?: string
}