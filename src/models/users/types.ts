'use strict'

export type User = {
  email: string
  id: string
  country: string
  full_name: string
  profile_url:string
  password?: string
  businesses: any[]
}
