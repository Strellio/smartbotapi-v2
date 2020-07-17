'use strict'
import updateById from './update-by-id'
import create from './create'

export default function businessService () {
  return {
    create,
    updateById
  }
}
