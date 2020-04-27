'use strict'

const AWS = require('aws-sdk')

/**
 * Create WebSocket connection
*/
const create = () => {
  const endpoint = 'ao6z251nh5.execute-api.eu-west-1.amazonaws.com/dev'

  return new AWS.ApiGatewayManagementApi({
    apiVersion: '2018-11-29',
    endpoint
  })
}

/**
 * Send WebSocket data to connection
*/
const send = async (connectionID, data) => {
  try {
    const websocket = create()

    const postParams = {
      ConnectionId: connectionID,
      Data: data
    }

    await websocket.postToConnection(postParams).promise()
  } catch (err) {
    console.log(err)
  }
}

module.exports = {
  send
}
