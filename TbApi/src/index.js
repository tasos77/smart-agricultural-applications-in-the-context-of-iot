import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import thingsboardApi from './api/thingsboardApi.js'
import { config } from './config/public.js'
import WebSocket from 'ws'
import { WebSocketServer } from 'ws'
import { calcSingleIcon } from './utils/commonTools.js'
import {
  transformTBDataToTimeseriesForecastAppFormat,
  transformTimeseriesForecastAppToTBDataFormat,
  aggregateHistoryData
} from './utils/convertions.js'
import { pumpFunc } from './utils/handlePump.js'
import { convertAlarmEvent } from './utils/convertAlarmEvent.js'
import forecastAppApi from './api/forecastAppApi.js'
const port = config.port
const domain = config.domain
const entityId = config.entityId
import moment from 'moment'
// try to get TB access token
const tbTokens = await thingsboardApi
  .login(config.tenantUsername, config.tenantPassword)
  .then((response) => response.data)
  .catch((e) => {
    console.log('Failed to get TB tokens..!')
  })

console.log(tbTokens.token)

let middlresponse = {
  msg: '',
  status: null,
  data: {}
}

if (tbTokens) {
  // create express application
  const app = express()
  // listen port 8081
  const server = app.listen(port, function () {
    const host = server.address().address
    const port = server.address().port
    console.log(`Example app listening at http://${domain}:${port}`)
  })

  // tell express to use body-parser's JSON parsing
  app.use(bodyParser.json())
  // avoid CORS errors
  app.use(
    cors({
      origin: '*'
    })
  )

  //////////////////////// LOGIN ////////////////////////
  app.post(`/login`, async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*')
    const loginInfo = {
      username: req.body.username,
      password: req.body.password
    }
    if (!!loginInfo.username && !!loginInfo.password) {
      thingsboardApi
        .login(loginInfo.username, loginInfo.password)
        .then((tbRes) => {
          res.status(200)
          middlresponse.msg = `Succ login`
          middlresponse.status = 200
          middlresponse.data = tbRes.data
          res.json(middlresponse)
        })
        .catch((e) => {
          res.status(400)
          middlresponse.msg = e.response.data.message
          middlresponse.status = 400
          res.json(middlresponse)
        })
    } else {
      res.status(400)
      middlresponse.msg = `Missing or invalid body!`
      middlresponse.status = 400
      res.json(middlresponse)
    }
  })
  //////////////////////// ACTIVATE USER ////////////////////////
  app.post(`/activateUser`, async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*')
    const activationInfo = {
      activateToken: req.body.activationInfo.activateToken,
      password: req.body.activationInfo.password
    }
    if (!!activationInfo.activateToken && !!activationInfo.password) {
      thingsboardApi
        .activateUser(tbTokens.token, activationInfo)
        .then(() => {
          res.status(200)
          middlresponse.msg = `User activated!`
          middlresponse.status = 200
          res.json(middlresponse)
        })
        .catch((e) => {
          res.status(400)
          middlresponse.msg = `Activation failed!`
          middlresponse.status = 400
          res.json(middlresponse)
        })
    } else {
      res.status(400)
      middlresponse.msg = `Missing or invalid body!`
      middlresponse.status = 400
      res.json(middlresponse)
    }
  })
  //////////////////////// CREATE USER ////////////////////////
  app.post(`/createUser`, async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*')
    const registrationInfo = {
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName
    }

    if (!!registrationInfo.email && !!registrationInfo.firstName && !!registrationInfo.lastName) {
      await thingsboardApi
        .createCustomer(tbTokens.token, registrationInfo.email)
        .then(async (response) => {
          const customerId = response.data.id.id
          await thingsboardApi
            .createUser(tbTokens.token, registrationInfo, customerId)
            .then(() => {
              res.status(200)
              middlresponse.msg = `TB user created!`
              middlresponse.status = 200
              res.json(middlresponse)
            })
            .catch((e) => {
              res.status(400)
              middlresponse.msg = `User creation failed!`
              middlresponse.status = 400
              res.json(middlresponse)
            })
        })
        .catch((e) => {
          res.status(400)
          middlresponse.msg = `Customer creation failed!`
          middlresponse.status = 400
          res.json(middlresponse)
        })
    } else {
      res.status(400)
      middlresponse.msg = `Missing or invalid body!`
      middlresponse.status = 400
      res.json(middlresponse)
    }
  })
  //////////////////////// LOGOUT  ////////////////////////
  app.post(`/logout`, async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*')
    const logoutInfo = {
      accessToken: req.body.accessToken
    }
    if (!!logoutInfo.accessToken) {
      thingsboardApi
        .logout(logoutInfo.accessToken)
        .then(() => {
          res.status(200)
          middlresponse.msg = `User logged out!`
          middlresponse.status = 200
          res.json(middlresponse)
        })
        .catch((e) => {
          res.status(400)
          middlresponse.msg = `User logout failed!`
          middlresponse.status = 400
          res.json(middlresponse)
        })
    } else {
      res.status(400)
      middlresponse.msg = `Missing or invalid body!`
      middlresponse.status = 400
      res.json(middlresponse)
    }
  })
  //////////////////////// GET USER ////////////////////////
  app.post(`/getUser`, async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*')
    const userInfo = {
      accessToken: req.body.accessToken
    }
    if (!!userInfo.accessToken) {
      thingsboardApi
        .getUser(userInfo.accessToken)
        .then((tbRes) => {
          res.status(200)
          middlresponse.msg = `Got user!`
          middlresponse.status = 200
          middlresponse.data = tbRes.data
          res.json(middlresponse)
        })
        .catch((e) => {
          res.status(400)
          middlresponse.msg = `Failed to get user!`
          middlresponse.status = 400
          res.json(middlresponse)
        })
    } else {
      res.status(400)
      middlresponse.msg = `Missing or invalid body!`
      middlresponse.status = 400
      res.json(middlresponse)
    }
  })
  //////////////////////// GET HISTORY ////////////////////////
  app.post(`/getHistory`, async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*')
    const telemetryRangeInfo = {
      startTs: req.body.startTs,
      endTs: req.body.endTs
    }
    if (!!telemetryRangeInfo.startTs && !!telemetryRangeInfo.endTs) {
      thingsboardApi
        .getTelemetryRange(
          tbTokens.token,
          entityId,
          telemetryRangeInfo.startTs,
          telemetryRangeInfo.endTs
        )
        .then((tbRes) => {
          const aggregatedHistoryData = aggregateHistoryData(tbRes.data)
          res.status(200)
          middlresponse.msg = `Got telemetry range!`
          middlresponse.status = 200
          middlresponse.data = aggregatedHistoryData
          res.json(middlresponse)
        })
        .catch((e) => {
          console.log(e)
          res.status(400)
          middlresponse.msg = 'Failed to get history data!'
          middlresponse.status = 400
          res.json(middlresponse)
        })
    } else {
      res.status(400)
      middlresponse.msg = `Missing or invalid body`
      middlresponse.status = 400
      res.json(middlresponse)
    }
  })

  //////////////////////  WATERING POLLING /////////////////////
  const watering = () => {
    const startTs = moment()
      .subtract(1 * 24, 'minutes')
      .valueOf()
    const endTs = moment()
      .subtract(0 * 24, 'minutes')
      .valueOf()

    thingsboardApi
      .getTelemetryRange(tbTokens.token, entityId, startTs, endTs)
      .then((tbRes) => {
        const timeseriesForecastAppFormatedData = transformTBDataToTimeseriesForecastAppFormat(
          tbRes.data
        )

        forecastAppApi
          .getPredictedData(timeseriesForecastAppFormatedData)
          .then((predictedMeasurements) => {
            const threshold = pumpFunc(predictedMeasurements.data)
            if (threshold) {
              console.log('Forecast under upper thresholds..!')
              const nextWatering = moment()
              console.log(`Next watering at ${nextWatering.format('h A')}`)

              thingsboardApi
                .updateDeviceSharedAttr(tbTokens.token, entityId, nextWatering)
                .then((response) => {
                  console.log(`Device Attribute Updated!`)
                })
                .catch((e) => {
                  console.log('Failed to update device attribute!')
                })
            }
          })
          .catch((e) => {
            console.log('Cant get forecast data...!!')
          })
      })
      .catch((e) => {
        console.log('Cant get tb data..!!')
      })
  }
  watering()
  // execute watering function every 24mins
  setInterval(watering, 1440000)

  //////////////////////// GET FORECAST ////////////////////////
  app.post(`/getForecast`, async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*')
    const telemetryRangeInfo = {
      startTs: req.body.startTs,
      endTs: req.body.endTs
    }

    if (!!telemetryRangeInfo.startTs && !!telemetryRangeInfo.endTs) {
      thingsboardApi
        .getTelemetryRange(
          tbTokens.token,
          entityId,
          telemetryRangeInfo.startTs,
          telemetryRangeInfo.endTs
        )
        .then((tbRes) => {
          const timeseriesForecastAppFormatedData = transformTBDataToTimeseriesForecastAppFormat(
            tbRes.data
          )

          forecastAppApi
            .getPredictedData(timeseriesForecastAppFormatedData)
            .then((predictedMeasurements) => {
              res.status(200)
              middlresponse.msg = `Got forecast data!`
              middlresponse.status = 200
              middlresponse.data = transformTimeseriesForecastAppToTBDataFormat(
                predictedMeasurements.data
              )
              res.json(middlresponse)
            })
            .catch((e) => {
              console.log(e)
              res.status(400)
              middlresponse.msg = 'Failed to get predicted data!'
              middlresponse.status = 400
              res.json(middlresponse)
            })
        })
        .catch((e) => {
          console.log(e.response.data)
          res.status(400)
          middlresponse.msg = 'Failed to get forecast data!'
          middlresponse.status = 400
          res.json(middlresponse)
        })
    } else {
      res.status(400)
      middlresponse.msg = `Missing or invalid body`
      middlresponse.status = 400
      res.json(middlresponse)
    }
  })

  //////////////////// GET DASHBOARD FORECASE ////////////////////
  app.post(`/getDashboardForecast`, async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*')
    const telemetryRangeInfo = {
      startTs: req.body.startTs,
      endTs: req.body.endTs
    }
    if (!!telemetryRangeInfo.startTs && !!telemetryRangeInfo.endTs) {
      thingsboardApi
        .getTelemetryRange(
          tbTokens.token,
          entityId,
          telemetryRangeInfo.startTs,
          telemetryRangeInfo.endTs
        )
        .then((tbRes) => {
          const timeseriesForecastAppFormatedData = transformTBDataToTimeseriesForecastAppFormat(
            tbRes.data
          )
          forecastAppApi
            .getPredictedData(timeseriesForecastAppFormatedData)
            .then((predictedMeasurements) => {
              res.status(200)
              middlresponse.msg = `Got forecast data!`
              middlresponse.status = 200
              middlresponse.data = transformTimeseriesForecastAppToTBDataFormat(
                predictedMeasurements.data
              )
              res.json(middlresponse)
            })
            .catch((e) => {
              console.log(e)
              res.status(400)
              middlresponse.msg = 'Failed to get predicted data!'
              middlresponse.status = 400
              res.json(middlresponse)
            })
        })
        .catch((e) => {
          console.log(e.response.data)
          res.status(400)
          middlresponse.msg = 'Failed to get forecast data!'
          middlresponse.status = 400
          res.json(middlresponse)
        })
    } else {
      res.status(400)
      middlresponse.msg = `Missing or invalid body`
      middlresponse.status = 400
      res.json(middlresponse)
    }
  })

  //////////////////////// GET TRAIN DATA ////////////////////////
  app.post(`/getTrainData`, async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*')
    const telemetryRangeInfo = {
      startTs: req.body.startTs,
      endTs: req.body.endTs
    }
    if (!!telemetryRangeInfo.startTs && !!telemetryRangeInfo.endTs) {
      thingsboardApi
        .getTelemetryRange(
          tbTokens.token,
          entityId,
          telemetryRangeInfo.startTs,
          telemetryRangeInfo.endTs
        )
        .then((tbRes) => {
          res.status(200)
          const timeseriesForecastAppFormatedData = transformTBDataToTimeseriesForecastAppFormat(
            tbRes.data
          )
          middlresponse.msg = `Got telemetry range!`
          middlresponse.status = 200
          middlresponse.data = timeseriesForecastAppFormatedData
          res.json(middlresponse)
        })
        .catch((e) => {
          console.log(e.response.data)
          res.status(400)
          middlresponse.msg = 'Failed to get history data!'
          middlresponse.status = 400
          res.json(middlresponse)
        })
    } else {
      res.status(400)
      middlresponse.msg = `Missing or invalid body`
      middlresponse.status = 400
      res.json(middlresponse)
    }
  })

  /////////////// Update device attribute /////////////////
  app.post(`/updateAttr`, async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*')
    const nextWatering = moment()
    console.log(nextWatering)
    thingsboardApi
      .updateDeviceSharedAttr(tbTokens.token, entityId, nextWatering)
      .then((response) => {
        res.status(200)
        middlresponse.msg = `Device Attribute Updated!`
        middlresponse.status = 200
        middlresponse.data = {}
        res.json(middlresponse)
      })
      .catch((e) => {
        console.log(e.response.data)
        res.status(400)
        middlresponse.msg = 'Failed to update device attribute!'
        middlresponse.status = 400
        res.json(middlresponse)
      })
  })

  ////////////////////// init telemetries socket //////////////////////
  const wss = new WebSocketServer({ port: 8080 })
  wss.on('connection', function connection(ws) {
    var token = tbTokens.token

    var webSocket = new WebSocket('ws://localhost:9090/api/ws')

    if (entityId === 'YOUR_DEVICE_ID') {
      console.log('Invalid device id!')
      webSocket.close()
    }

    if (token === 'YOUR_JWT_TOKEN') {
      console.log('Invalid JWT token!')
      webSocket.close()
    }

    webSocket.on('error', console.error)

    webSocket.onopen = function () {
      var object = {
        authCmd: {
          cmdId: 0,
          token: token
        },
        cmds: [
          {
            entityType: 'DEVICE',
            entityId: entityId,
            scope: 'LATEST_TELEMETRY',
            cmdId: 1,
            type: 'TIMESERIES'
          },
          {
            cmdId: 2,
            query: {
              alarmFields: [
                {
                  type: 'ALARM_FIELD',
                  key: 'createdTime'
                },
                {
                  type: 'ALARM_FIELD',
                  key: 'originator'
                },
                {
                  type: 'ALARM_FIELD',
                  key: 'type'
                },
                {
                  type: 'ALARM_FIELD',
                  key: 'severity'
                },
                {
                  type: 'ALARM_FIELD',
                  key: 'status'
                },
                {
                  type: 'ALARM_FIELD',
                  key: 'assignee'
                }
              ],
              entityFields: [],
              entityFilter: {
                type: 'singleEntity',
                singleEntity: {
                  entityType: 'DEVICE',
                  id: '587325a0-b7bc-11ee-a93d-57cbe3542689'
                }
              },
              latestValues: [],
              pageLink: {
                page: 0,
                pageSize: 10,
                searchPropagatedAlarms: false,
                severityList: [],
                sortOrder: {
                  direction: 'DESC',
                  key: {
                    key: 'createdTime',
                    type: 'ALARM_FIELD'
                  }
                },
                statusList: [],
                textSearch: null,
                timeWindow: 86400000,
                typeList: []
              }
            },
            type: 'ALARM_DATA'
          },
          {
            cmdId: 3,
            latestCmd: {
              keys: [
                {
                  type: 'ATTRIBUTE',
                  key: 'pump_state'
                }
              ]
            },
            query: {
              entityFields: [
                { key: 'name', type: 'ENTITY_FIELD' },
                { key: 'label', type: 'ENTITY_FIELD' },
                { key: 'additionalInfo', type: 'ENTITY_FIELD' }
              ],
              entityFilter: {
                singleEntity: {
                  entityType: 'DEVICE',
                  id: '587325a0-b7bc-11ee-a93d-57cbe3542689'
                },
                type: 'singleEntity'
              },
              latestValues: [{ key: 'pump_state', type: 'ATTRIBUTE' }],
              pageLink: {
                dynamic: true,
                page: 0,
                pageSize: 10,
                sortOrder: null,
                textSearch: null
              }
            },
            type: 'ENTITY_DATA'
          }
        ]
      }
      var data = JSON.stringify(object)
      webSocket.send(data)
      console.log('Message is sent: ' + data)
    }

    webSocket.onmessage = function (event) {
      let parsedData = JSON.parse(event.data)

      if (parsedData?.subscriptionId === 1) {
        let parsedRawTBtelemetries = parsedData.data

        let formatedTbTelemetries = {
          timestamp: parsedRawTBtelemetries.temperature[0][0],
          temperature: parseFloat(parsedRawTBtelemetries.temperature[0][1]),
          humidity: parseFloat(parsedRawTBtelemetries.humidity[0][1]),
          rain: parseFloat(parsedRawTBtelemetries.rain[0][1]),
          soilMoisture: parseFloat(parsedRawTBtelemetries.soilMoisture[0][1]),
          uv: parseFloat(parsedRawTBtelemetries.uv[0][1]),
          icon: calcSingleIcon(
            parseFloat(parsedRawTBtelemetries.rain[0][1]),
            parsedRawTBtelemetries.temperature[0][0]
          )
        }

        console.log(formatedTbTelemetries)
        ws.send(JSON.stringify(formatedTbTelemetries))
      } else if (parsedData.cmdId === 3) {
        const pump_state_enum = parsedData?.update
          ? parsedData?.update[0]?.latest?.ATTRIBUTE?.pump_state?.value
          : null
        console.log(pump_state_enum)
        ws.send(JSON.stringify(pump_state_enum))
      } else {
        let alarmName = parsedData?.update ? `${parsedData.update[0].name}` : null

        const alarmMetadata = convertAlarmEvent(alarmName)
        console.log(alarmMetadata)
        ws.send(JSON.stringify(alarmMetadata))
      }
    }

    webSocket.onclose = function (event) {
      console.log('TB WS Connection is closed!')
    }

    ws.on('error', console.error)

    ws.on('message', function message(data) {
      console.log('received: %s', data)
    })
  })
}
