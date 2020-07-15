'use strict'
import { compact } from 'lodash/fp'

/**
 * Convert sort as string to sortMap
 * @example
 * Usage
 * const sort = "-created_at" || "created_at"
 * formSortCriteria(sort)
 * @param {String} sortString
 */
export default function formSortCriteria (sort: string = '') {
  const sortToArray = compact(sort.split(','))
  const sortsMap = sortToArray.reduce((acc: Map<any, any>, sort: string) => {
    const sortPrefix = sort.startsWith('-') ? -1 : 1
    const sortKey = sort.startsWith('-') ? sort.substr(1) : sort
    acc.set(sortKey, sortPrefix)
    return acc
  }, new Map())

  // always sort by _id even if no other sort is defined
  sortsMap.set('_id', -1)
  return sortsMap
}
