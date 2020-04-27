const Responses = require('../common/API_responses')
const Dynamo = require('../common/Dynamo')
const crypto = require('crypto-js')

const tableName = process.env.tableNameUserSettings

/**
 * GET handler for /settings endpoint
 */
module.exports.GEThandler = async event => {
  try {
    if (!event.headers.Authorization) return Responses._401({ message: 'Unauthorized' })

    const clientSecret = event.headers.Authorization
    const secret = process.env.HOOK_SECRET
    const cryptoSecret = process.env.CRYPTO_SECRET

    const bytes = crypto.AES.decrypt(clientSecret, cryptoSecret)
    const decryptedClientSecret = bytes.toString(crypto.enc.Utf8)

    if (secret === decryptedClientSecret) {
      const queries = event.queryStringParameters
      const userID = queries.userID

      // Get saved user settings from DynamoDB
      const settings = await Dynamo.get(Number(userID), tableName)

      return Responses._200({ settings: settings })
    } else {
      return Responses._401({ message: 'Unauthorized' })
    }
  } catch (err) {
    console.log(err)

    return Responses._401({ message: 'Unauthorized' })
  }
}

/**
 * POST handler for /settings endpoint
 */
module.exports.POSThandler = async event => {
  try {
    if (!event.headers.Authorization) return Responses._401({ message: 'Unauthorized' })

    const clientSecret = event.headers.Authorization
    const secret = process.env.HOOK_SECRET
    const cryptoSecret = process.env.CRYPTO_SECRET

    const bytes = crypto.AES.decrypt(clientSecret, cryptoSecret)
    const decryptedClientSecret = bytes.toString(crypto.enc.Utf8)

    if (secret === decryptedClientSecret) {
      const body = JSON.parse(event.body)

      const { userID, settings } = body

      // Check if user has saved settings
      const dataExists = await Dynamo.get(userID, tableName)

      if (Object.keys(dataExists).length) {
        // Update user settings
        const UpdateExpression = 'set settings = :s'
        const ExpressionAttributeValues = {
          ':s': JSON.stringify(settings)
        }

        await Dynamo.update(userID, tableName, UpdateExpression, ExpressionAttributeValues)
      } else {
        // Create user settings
        const data = {
          ID: userID,
          settings: JSON.stringify(settings),
          date: Date.now()
        }

        await Dynamo.write(data, tableName)
      }

      return Responses._200({ message: 'Recieved data' })
    } else {
      return Responses._401({ message: 'Unauthorized' })
    }
  } catch (err) {
    console.log(err)

    return Responses._401({ message: 'Unauthorized' })
  }
}
