'use strict'

const Responses = require('../common/API_responses')
const WebSocket = require('../common/websocketMessage')

/**
 * Message WebSocket handler
 * Send data to socket connection
 */
exports.handler = async event => {
  console.log('Event: ', event)

  const { connectionId: connectionID } = event.requestContext

  try {
    await WebSocket.send({
      connectionID,
      message: 'Got data'
    })

    return Responses._200({ message: 'Got data' })
  } catch (error) {
    return Responses._400({ message: 'Data could not be recieved' })
  }
}
