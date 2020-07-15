'use strict'

const customError = (data: any) => {}

export default {
  removeCriteriaCannotBeEmptyError: () => {
    return customError({
      name: 'RemoveCriteriaCannotBeEmptyError',
      message: 'Criteria for removing documents must be a non-empty object'
    })
  },
  limitNaNError: () =>
    customError({
      name: 'LimitNotANumber',
      message: 'Limit must be a number'
    })
}
