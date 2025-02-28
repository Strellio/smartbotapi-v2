'use strict'
import formWhereCriteria from './form-where-criteria'
import formSortCriteria from './form-sort-criteria'
import errors from './errors'
import { Model as MongooseModel } from 'mongoose'
import config from '../../../../config'

const DEFAULT_MAXIMUM_LIMIT = 200

export interface PaginateParams {
  /**
   *  - object specifying search query
   */
  query?: any
  /**
   * - a search text
   */
  search?: string
  /**
   * - Sorting criteria
   */
  sort?: string
  /**
   *  - true to return lean documents
   */
  lean?: boolean
  after?: string
  limit?: string
  /**
   * - space delimited list of fields to populate or a populate Array
   */
  populate?: Array<any> | string
  /**
   * - transformation function to apply before stream data is emitted
   */
  transform?: any
  /**
   *  the maximum number items to fetch
   */
  maximumLimit?: number
}

/**
 * Performs a pagination query
 */
const paginate = (Model: MongooseModel<any>, count: Function) => async ({
  query = {},
  search,
  sort,
  lean = true,
  after,
  limit = '10',
  populate = '',
  transform,
  maximumLimit = DEFAULT_MAXIMUM_LIMIT
}: PaginateParams = {}) => {
  if (search) {
    query.$text = { $search: search }
  }

  let parsedLimit: number = parseInt(limit)

  parsedLimit = parsedLimit > maximumLimit ? maximumLimit : parsedLimit
  console.log(parsedLimit)

  if (isNaN(parsedLimit)) throw errors.limitNaNError()

  const sortCriteria = formSortCriteria(sort)

  const whereCriteria = formWhereCriteria({
    after,
    sortCriteria
  })

  const tempModel = Model.find(query)
  if (whereCriteria) {
    tempModel.where(whereCriteria)
  }

  const data = await tempModel
    .limit(parsedLimit)
    .populate(populate)
    .sort(Array.from(sortCriteria))
    .exec()

  return {
    data,
    count: (await count(query)) as number,
    next_item_cursor: data[data.length - 1]?._id
  }
}

export default paginate
