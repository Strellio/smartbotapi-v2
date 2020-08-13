import { required } from "../../lib/utils";
export enum STATUS_MAP {
  ACTIVE = 'A',
  DEACTIVATED = 'D'
}


export enum ACTION_TYPE_TO_MONGODB_FIELD {
  CREATE = "CREATE",
  DELETE = "DELETE",
  EDIT = "EDIT"
}

const convertObjectToDotNotation = (queryKey: string, queryObject: any) => Object.keys(queryObject).reduce((acc: {
  [x: string]: any
}, key) => {
  const value = queryObject[key]
  acc[`${queryKey}.$.${key}`] = value
  return acc
}, {})


export const convertObjectBasedOnActionType = ({ payloadFieldName = required("payloadFieldName"), updatePayload = required("updatePayload"), dbFieldName = payloadFieldName }: {
  payloadFieldName: string
  updatePayload: any
  dbFieldName?: string
}) => {
  const objectField = updatePayload[payloadFieldName]
  if (!objectField) return updatePayload
  delete updatePayload[payloadFieldName]

  const { action_type, ...rest } = objectField

  if (action_type === ACTION_TYPE_TO_MONGODB_FIELD.EDIT) {
    return {
      $set: convertObjectToDotNotation(dbFieldName, rest),
      ...updatePayload
    }
  }
  if (action_type === ACTION_TYPE_TO_MONGODB_FIELD.CREATE) {
    return {
      $addToSet: {
        [dbFieldName]: rest
      },
      ...updatePayload
    }
  }
  if (action_type === ACTION_TYPE_TO_MONGODB_FIELD.DELETE) {
    return {
      $pull: {
        [dbFieldName]: rest
      }
    }
  }
}