const AWS = require('aws-sdk')

const ses = new AWS.SES()

/**
 * Handle Amazon Simple Email Service
 */
const SES = {
  /**
   * Send email
   */
  async sendEmail (to, message, subject, from) {
    const params = {
      Destination: {
        ToAddresses: to
      },
      Message: {
        Body: {
          Text: { Data: message }
        },
        Subject: { Data: subject }
      },
      Source: from
    }

    try {
      await ses.sendEmail(params).promise()
    } catch (err) {
      console.log('Error sending email: ', err)
    }
  }
}

module.exports = SES
