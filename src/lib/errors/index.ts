'use strict'
import customError from './custom-error'

export default {
  throwError: customError,
  MissingFunctionParamError: 'MissingFunctionParamError',
  ResourceAlreadyExists: 'ResourceAlreadyExists',
  ResourceDoesNotExists: 'ResourceDoesNotExists',
  ValidationError: 'ValidationError',
  OnlyOneChatPlatformCanBeOnSiteAndActiveError:
    'OnlyOneChatPlatformCanBeOnSiteAndActiveError',
  WebhookValidationFailed: 'WebhookValidationFailed',
  InvalidPasswordOrEmailError: 'InvalidPasswordOrEmailError',
  InvalidVerificationCode: 'InvalidVerificationCode'

}
