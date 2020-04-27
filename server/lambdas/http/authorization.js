'use strict'

const Responses = require('../common/API_responses')
const https = require('https')
const { URL } = require('url')

const clientID = process.env.GITHUB_CLIENT_ID
const clientSecret = process.env.GITHUB_CLIENT_SECRET
const callBackURL = 'https://github.perssonrichard.org/callback'

/**
 * Extract code from query string
 */
const extractCode = event => {
  const queryStringParameters = event.queryStringParameters || {}
  return queryStringParameters.code
}

/**
 * Exchange code for a GitHub Token
 */
const exchangeCodeForToken = async code => {
  const url = new URL('/login/oauth/access_token', 'https://github.com')
  url.searchParams.set('client_id', clientID)
  url.searchParams.set('client_secret', clientSecret)
  url.searchParams.set('code', code)

  return asyncHttpsPostRequest(url)
}

/**
 * Post request
 */
const asyncHttpsPostRequest = async url => {
  return new Promise(function (resolve, reject) {
    https.request({
      method: 'POST',
      host: url.host,
      path: url.pathname + url.search,
      headers: {
        Accept: 'application/json'
      }
    }, (resp) => {
      let data = ''
      resp.on('data', (chunk) => {
        data += chunk
      })
      resp.on('end', () => {
        try {
          const parsed = JSON.parse(data)
          resolve(parsed)
        } catch (e) {
          reject(data)
        }
      })
    }).on('error', reject)
      .end()
  })
}

/**
 * GET handler for /authorization endpoint
 */
module.exports.handler = async event => {
  try {
    const code = extractCode(event)

    if (!code) {
      return Responses._400({ message: 'Code not provided' })
    }

    const response = await exchangeCodeForToken(code)

    return {
      statusCode: 302,
      headers: {
        Location: callBackURL + '?access_token=' + response.access_token
      },
      body: null
    }
  } catch (err) {
    return Responses._400({ err })
  }
}
