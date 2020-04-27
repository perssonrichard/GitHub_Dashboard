'use strict'

const Responses = require('../common/API_responses')
const Dynamo = require('../common/Dynamo')

const tableName = process.env.tableNameWebSocket

/**
 * WebSocket connect handler
 * Called when client connects via WebSocket
 * Stores conection and user id to Dynamo
*/
exports.handler = async event => {
  console.log('Event: ', event)
  const { connectionId: connectionID, domainName, stage } = event.requestContext

  const queries = event.queryStringParameters
  const userID = queries.userID

  const data = {
    ID: connectionID,
    userID,
    date: Date.now(),
    domainName,
    stage
  }

  await Dynamo.write(data, tableName)

  return Responses._200({ message: 'connected' })
}
