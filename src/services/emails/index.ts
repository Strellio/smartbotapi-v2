'use strict'

import EmailTemplates from 'email-templates'
import nodemailer from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'
import path from 'path'
import config from '../../config'

import { EMAIL_TEMPLATES } from './types'
import { required } from '../../lib/utils'
import logger from '../../lib/logger'


const defaultTransporter = nodemailer.createTransport({
  host: config.EMAIL_SMTP_HOST,
    secure: true,
    tls: {
        rejectUnauthorized: !config.isTest
      },
  port: config.EMAIL_SMTP_PORT,
  auth: {
    user: "no-reply@strellio.co",
    pass: config.EMAIL_SMTP_PASSWORD,
  },
});



const DEFAULT_FROM = 'no-reply@strellio.co'

export default function sendEmail({
  to = required('to'),
  metadata = required('metadata'),
  template = required('template'),
  tagLine = 'Strellio',
  transport = defaultTransporter,
  from = DEFAULT_FROM,
  attachments
}: {
  metadata: object
  from?: string
  tagLine?: string
  to: string
  template: EMAIL_TEMPLATES
  transport?: nodemailer.Transporter<SMTPTransport.SentMessageInfo>
  attachments?: Mail.Attachment[]
}) {
  const email = new EmailTemplates({
    transport,
    send: true,
    preview: !config.isProduction && !config.isTest,
    message: {
      from: `${tagLine} <${from}>`,
      attachments
    },
    views: {
      options: {
        extension: 'ejs'
      }
    },
    juice: true,
    juiceResources: {
      preserveImportant: true,
      webResources: {
        relativeTo: path.resolve('public')
      }
    }
  })

  return email
    .send({
      message: {
        to
      },
      template: path.join(__dirname, `./${template}`),
      locals: {
        ...metadata,
      }
    })
    .catch((error) => {
      logger().error(error)
    })
}
