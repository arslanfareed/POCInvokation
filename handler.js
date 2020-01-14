/* eslint-disable no-async-promise-executor */
'use strict'
var AWS = require('aws-sdk')
const response = require('./libs/response')

module.exports.hello = async event => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v1.0! Your function executed successfully!',
        input: event
      },
      null,
      2
    )
  }
}

module.exports.communication = async (event, context, callback) => {
  const lambda = new AWS.Lambda(
    {
      apiVersion: '2015-03-31',
      region: 'us-east-2',
      logger: console

    }
  )
  const params = {
    FunctionName: 'responder', // the lambda function we are going to invoke
    InvocationType: 'RequestResponse',
    LogType: 'Tail',
    Payload: '{ "name" : "Arslan" }'

  }

  console.log('About to Invoke')
  return new Promise(async () => {
    await lambda.invoke(params, async function (err, data) {
      if (err) {
        console.log('error ' + err)
        callback(err)
      } else {
        console.log('Success ' + data.Payload)
        callback(
          null,
          response.success({ body: JSON.parse(data.Payload) })
        )
      }
    })
  })
}

module.exports.responder = async (event, context, callback) => {

  console.log('Lambda B Received event:', JSON.stringify(event, null, 2))
  callback(
    null,
    response.success({ body: 'Hello Mr.' + event.name +". I hope You are doing good"})
  )
}
