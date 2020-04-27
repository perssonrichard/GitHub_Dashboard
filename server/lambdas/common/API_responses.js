'use strict'

/**
 * HTTP responses
*/
const Responses = {
  /**
   * 200 response
   */
  _200 (data = {}) {
    return {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Origin': '*'
      },
      statusCode: 200,
      body: JSON.stringify(data)
    }
  },

  /**
   * 400 response
   */
  _400 (data = {}) {
    return {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Origin': '*'
      },
      statusCode: 400,
      body: JSON.stringify(data)
    }
  },

  /**
   * 401 response
   */
  _401 (data = {}) {
    return {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Origin': '*'
      },
      statusCode: 401,
      body: JSON.stringify(data)
    }
  }
}

module.exports = Responses
