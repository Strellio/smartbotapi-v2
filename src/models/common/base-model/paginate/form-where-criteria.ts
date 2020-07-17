'use strict'

import isDescendingSort from './is-descending-sort'
import formCursorAndSortValue from './form-cursor-and-sort-value'

/**
 * Form where query
 */
export default function formWhereCriteria ({
  after,
  sortCriteria
}: {
  /**
   *  - mongoose object id of the last item in a pagination result the rating value of the last item in a pagination result
   */
  after?: string
  /**
   * - the sort criteria. Example { rating: -1 }
   */
  sortCriteria: Map<any, any>
}) {
  if (!after) return
  const { afterSortKey, after: cursor } = formCursorAndSortValue(after)

  const mainSortKey = sortCriteria.keys().next().value
  const hasNonIdSortAndAfterSortKey = afterSortKey && mainSortKey !== '_id'

  const sortKey = hasNonIdSortAndAfterSortKey ? mainSortKey : '_id'
  const newAfterSortKey = hasNonIdSortAndAfterSortKey ? afterSortKey : cursor

  return {
    $or: [
      {
        [sortKey]: isDescendingSort(sortCriteria)
          ? { $lt: newAfterSortKey }
          : { $gt: newAfterSortKey }
      },
      { [sortKey]: newAfterSortKey, _id: { $lt: cursor } }
    ]
  }
}
