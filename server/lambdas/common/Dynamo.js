'use strict'

const AWS = require('aws-sdk')
const documentClient = new AWS.DynamoDB.DocumentClient()

/**
 * Handle DynamoDB
 */
const Dynamo = {
  /**
   * Scan table
   */
  async scan (params) {
    try {
      const data = await documentClient.scan(params).promise()

      if (!data || !data.Items) {
        return {}
      }

      return data.Items
    } catch (err) {
      console.log(err)
    }
  },

  /**
   * Query table
   */
  async query (params) {
    try {
      const data = await documentClient.query(params).promise()

      return data
    } catch (err) {
      console.log(err)
    }
  },

  /**
   * Get data from table
   */
  async get (ID, TableName) {
    const params = {
      TableName,
      Key: {
        ID
      }
    }

    const data = await documentClient.get(params).promise()

    if (!data || !data.Item) {
      return {}
    }

    return data.Item
  },

  /**
   * Write data to table
   */
  async write (data, TableName) {
    if (!data.ID) throw Error('No ID on the data')

    const params = {
      TableName,
      Item: data
    }

    const response = await documentClient.put(params).promise()

    if (!response) {
      throw Error(`There was an error inserting ID of ${data.ID} in table ${TableName}`)
    }

    return response
  },

  /**
   * Update table
   */
  async update (ID, TableName, UpdateExpression, ExpressionAttributeValues) {
    try {
      const params = {
        TableName,
        Key: {
          ID
        },
        UpdateExpression,
        ExpressionAttributeValues,
        ReturnValues: 'UPDATED_NEW'
      }

      const response = await documentClient.update(params).promise()

      if (!response) {
        throw Error(`There was an error modifying ${ID} in table ${TableName}`)
      }

      return response
    } catch (err) {
      console.log(err.message)
    }
  },

  /**
   * Delete data from table
   */
  async delete (ID, TableName) {
    const params = {
      TableName,
      Key: {
        ID
      }
    }

    return documentClient.delete(params).promise()
  }
}

module.exports = Dynamo
