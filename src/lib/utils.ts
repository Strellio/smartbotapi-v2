'use strict'

export const required = (data: any) => {
  throw new Error(`${data} is required`)
}
