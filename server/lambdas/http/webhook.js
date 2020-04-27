const Responses = require('../common/API_responses')
const SES = require('../common/SES')
const Dynamo = require('../common/Dynamo')
const webSocketMessage = require('../common/websocketMessage')
const crypto = require('crypto-js')
const { v4: uuidv4 } = require('uuid')

const tableNameUserSettings = process.env.tableNameUserSettings
const tableNameWebSocket = process.env.tableNameWebSocket

/**
 * POST handler for /webhook endpoint
 */
module.exports.handler = async event => {
  try {
    // Check if GitHub is the requester
    if (!event.headers['User-Agent'].includes('GitHub-Hookshot')) {
      return Responses._401({ message: 'Not Authorized' })
    }

    const secret = process.env.HOOK_SECRET
    let payload = event.body
    const ourSignature = crypto.HmacSHA1(payload, secret).toString()
    const theirSignature = event.headers['X-Hub-Signature']

    if (theirSignature.includes(ourSignature)) {
      payload = JSON.parse(event.body)

      const repoEvent = event.headers['X-GitHub-Event']
      const repoID = payload.repository.id

      // Search for users subscribing to repo
      const users = await Dynamo.scan({
        TableName: tableNameUserSettings,
        FilterExpression: 'contains (#settings, :repoID)',
        ExpressionAttributeNames: {
          '#settings': 'settings'
        },
        ExpressionAttributeValues: {
          ':repoID': repoID.toString()
        }
      })

      // Filter out users not subscribing to the specific event
      const subscribers = users.filter(obj => {
        const parsed = JSON.parse(obj.settings)
        for (let i = 0; i < parsed.length; i++) {
          if (parsed[i].repoID !== repoID) {
            return false
          }

          if (!parsed[i].setting.includes(repoEvent)) {
            return false
          }
        }

        return true
      })

      const allSocketUsers = await Dynamo.scan({ TableName: tableNameWebSocket })
      const allUserIDs = subscribers.map(s => s.ID.toString())

      // Check if user is online or offline
      const socketUsers = allSocketUsers.filter(obj => { return allUserIDs.indexOf(obj.userID) > -1 })
      const socketUserIDs = socketUsers.map(obj => obj.userID)
      const offlineUserIDs = allUserIDs.filter(id => !socketUserIDs.includes(id))
      const offlineUsers = subscribers.filter(obj => offlineUserIDs.includes(String(obj.ID)))

      // Send payload to all socket connections
      payload.event = repoEvent
      payload.date = new Date()
      payload.id = uuidv4()
      await Promise.all(
        socketUsers.map(user => {
          return webSocketMessage.send(user.ID, JSON.stringify(payload))
        })
      )

      // Send mail to subscribers without a socket connection
      const noteEvent = payload.event
      const action = payload.action
      const repository = payload.repository.name
      const repoURL = payload.repository.html_url
      const organization = payload.organization.login

      const to = offlineUsers.map(obj => obj.email)
      const from = process.env.EMAIL
      const subject = `GitHub Dashboard Notification! Type: ${noteEvent}`
      const message = `You got a notification! An event of type ${noteEvent} was ${action} in repository ${repository} of organization ${organization}. RepoURL: ${repoURL}`

      if (to.length) await SES.sendEmail(to, message, subject, from)

      return Responses._200({ message: 'Got data' })
    } else {
      return Responses._401({ message: 'Not Authorized' })
    }
  } catch (err) {
    console.log(err)
  }
}
