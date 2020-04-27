const Responses = require('../common/API_responses')
const Dynamo = require('../common/Dynamo')
const crypto = require('crypto-js')

const tableName = process.env.tableNameUserSettings

/**
 * POST handler for /emailSettings endpoint
 */
module.exports.handler = async event => {
  try {
    if (!event.headers.Authorization) return Responses._401({ message: 'Unauthorized' })

    const clientSecret = event.headers.Authorization
    const secret = process.env.HOOK_SECRET
    const cryptoSecret = process.env.CRYPTO_SECRET

    const bytes = crypto.AES.decrypt(clientSecret, cryptoSecret)
    const decryptedClientSecret = bytes.toString(crypto.enc.Utf8)

    if (secret === decryptedClientSecret) {
      const body = JSON.parse(event.body)

      const { userID, email } = body

      const UpdateExpression = 'set email = :e'
      const ExpressionAttributeValues = {
        ':e': email
      }

      // Update user email
      await Dynamo.update(userID, tableName, UpdateExpression, ExpressionAttributeValues)

      return Responses._200({ message: 'Got data' })
    } else {
      return Responses._401({ message: 'Unauthorized' })
    }
  } catch (err) {
    console.log(err)

    return Responses._401({ message: 'Unauthorized' })
  }
}
