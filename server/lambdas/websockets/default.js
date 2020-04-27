'use strict'

const Responses = require('../common/API_responses')

/**
 * Default WebSocket handler
 */
exports.handler = async event => {
  console.log('Event: ', event)

  return Responses._200({ message: 'default' })
}
