import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import moment from 'moment'
import WebSocket, { WebSocketServer } from 'ws'
import forecastAppApi from './api/forecastAppApi.js'
import thingsboardApi from './api/thingsboardApi.js'
import { conf as config } from './config/index.js'
import { calcSingleIcon } from './utils/commonTools.js'
import { convertAlarmEvent } from './utils/convertAlarmEvent.js'
import {
  aggregateHistoryData,
  transformTBDataToTimeseriesForecastAppFormat,
  transformTimeseriesForecastAppToTBDataFormat
} from './utils/convertions.js'
import { pumpFunc } from './utils/handlePump.js'

const port = config.thingsBoard.port
const domain = config.thingsBoard.domain
const entityId = config.thingsBoard.entityId

// try to get TB access token
const global.tbTokens = await thingsboardApi
  .login(config.thingsBoard.tenantUsername, config.thingsBoard.tenantPassword)
  .then((response) => response.data)
  .catch((e) => {
    console.log('Failed to get TB tokens..!')
  })

console.log(global.tbTokens.token)

const middlresponse = {
  msg: '',
  status: null,
  data: {}
}

if (global.tbTokens) {
  // create express application
  const app = express()
  // listen port 8081
  const server = app.listen(port, () => {
    const host = server.address().address
    const port = server.address().port
    console.log(`Server listening at http://${domain}:${port}`)
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
          middlresponse.data = {}
          res.json(middlresponse)
        })
    } else {
      res.status(400)
      middlresponse.msg = `Missing or invalid body!`
      middlresponse.status = 400
      middlresponse.data = {}
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
        .activateUser(global.tbTokens.token, activationInfo)
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
          middlresponse.data = {}
          res.json(middlresponse)
        })
    } else {
      res.status(400)
      middlresponse.msg = `Missing or invalid body!`
      middlresponse.status = 400
      middlresponse.data = {}
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

    if (
      !!registrationInfo.email &&
      !!registrationInfo.firstName &&
      !!registrationInfo.lastName
    ) {
      await thingsboardApi
        .createCustomer(global.tbTokens.token, registrationInfo.email)
        .then(async (response) => {
          const customerId = response.data.id.id
          await thingsboardApi
            .createUser(global.tbTokens.token, registrationInfo, customerId)
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
              console.log(e)
              middlresponse.data = {}
              res.json(middlresponse)
            })
        })
        .catch((e) => {
          res.status(400)
          middlresponse.msg = `Customer creation failed!`
          middlresponse.status = 400
          middlresponse.data = {}
          res.json(middlresponse)
        })
    } else {
      res.status(400)
      middlresponse.msg = `Missing or invalid body!`
      middlresponse.status = 400
      middlresponse.data = {}
      res.json(middlresponse)
    }
  })
  //////////////////////// LOGOUT  ////////////////////////
  app.post(`/logout`, async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*')
    const logoutInfo = {
      accessToken: req.body.accessToken
    }
    if (logoutInfo.accessToken) {
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
          middlresponse.data = {}
          res.json(middlresponse)
        })
    } else {
      res.status(400)
      middlresponse.msg = `Missing or invalid body!`
      middlresponse.status = 400
      middlresponse.data = {}
      res.json(middlresponse)
    }
  })
  //////////////////////// GET USER ////////////////////////
  app.get(`/user`, async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*')
    const userInfo = {
      accessToken: req.query.accessToken
    }
    if (userInfo.accessToken) {
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
          middlresponse.data = {}
          res.json(middlresponse)
        })
    } else {
      res.status(400)
      middlresponse.msg = `Missing or invalid body!`
      middlresponse.status = 400
      middlresponse.data = {}
      res.json(middlresponse)
    }
  })
  //////////////////////// GET HISTORY ////////////////////////
  app.get(`/history`, async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*')
    const telemetryRangeInfo = {
      startTs: req.query.startTs,
      endTs: req.query.endTs
    }
    if (!!telemetryRangeInfo.startTs && !!telemetryRangeInfo.endTs) {
      thingsboardApi
        .getTelemetryRange(
          global.tbTokens.token,
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
          middlresponse.data = {}
          res.json(middlresponse)
        })
    } else {
      res.status(400)
      middlresponse.msg = `Missing or invalid body`
      middlresponse.status = 400
      middlresponse.data = {}
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
      .getTelemetryRange(global.tbTokens.token, entityId, startTs, endTs)
      .then((tbRes) => {
        const timeseriesForecastAppFormatedData =
          transformTBDataToTimeseriesForecastAppFormat(tbRes.data)

        forecastAppApi
          .getPredictedData(timeseriesForecastAppFormatedData)
          .then((predictedMeasurements) => {
            const threshold = pumpFunc(predictedMeasurements.data)
            if (threshold) {
              console.log('Forecast under upper thresholds..!')
              const nextWatering = moment()
              console.log(`Next watering at ${nextWatering.format('h A')}`)

              thingsboardApi
                .updateDeviceSharedAttr(global.tbTokens.token, entityId, nextWatering)
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
  app.get(`/forecast`, async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*')
    const telemetryRangeInfo = {
      startTs: req.query.startTs,
      endTs: req.query.endTs
    }

    if (!!telemetryRangeInfo.startTs && !!telemetryRangeInfo.endTs) {
      thingsboardApi
        .getTelemetryRange(
          global.tbTokens.token,
          entityId,
          telemetryRangeInfo.startTs,
          telemetryRangeInfo.endTs
        )
        .then((tbRes) => {
          const timeseriesForecastAppFormatedData =
            transformTBDataToTimeseriesForecastAppFormat(tbRes.data)

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
              middlresponse.data = {}
              res.json(middlresponse)
            })
        })
        .catch((e) => {
          console.log(e.response.data)
          res.status(400)
          middlresponse.msg = 'Failed to get forecast data!'
          middlresponse.status = 400
          middlresponse.data = {}
          res.json(middlresponse)
        })
    } else {
      res.status(400)
      middlresponse.msg = `Missing or invalid body`
      middlresponse.status = 400
      middlresponse.data = {}
      res.json(middlresponse)
    }
  })

  //////////////////// GET DASHBOARD FORECAST ////////////////////
  app.get(`/dashboardForecast`, async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*')
    const telemetryRangeInfo = {
      startTs: req.query.startTs,
      endTs: req.query.endTs
    }
    if (!!telemetryRangeInfo.startTs && !!telemetryRangeInfo.endTs) {
      thingsboardApi
        .getTelemetryRange(
          global.tbTokens.token,
          entityId,
          telemetryRangeInfo.startTs,
          telemetryRangeInfo.endTs
        )
        .then((tbRes) => {
          const timeseriesForecastAppFormatedData =
            transformTBDataToTimeseriesForecastAppFormat(tbRes.data)
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
              middlresponse.data = {}
              res.json(middlresponse)
            })
        })
        .catch((e) => {
          console.log(e.response.data)
          res.status(400)
          middlresponse.msg = 'Failed to get forecast data!'
          middlresponse.status = 400
          middlresponse.data = {}
          res.json(middlresponse)
        })
    } else {
      res.status(400)
      middlresponse.msg = `Missing or invalid body`
      middlresponse.status = 400
      middlresponse.data = {}
      res.json(middlresponse)
    }
  })

  //////////////////////// GET TRAIN DATA ////////////////////////
  app.get(`/trainData`, async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*')
    const telemetryRangeInfo = {
      startTs: req.query.startTs,
      endTs: req.query.endTs
    }

    if (!!telemetryRangeInfo.startTs && !!telemetryRangeInfo.endTs) {
      thingsboardApi
        .getTelemetryRange(
          global.tbTokens.token,
          entityId,
          telemetryRangeInfo.startTs,
          telemetryRangeInfo.endTs
        )
        .then((tbRes) => {
          res.status(200)
          const timeseriesForecastAppFormatedData =
            transformTBDataToTimeseriesForecastAppFormat(tbRes.data)
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
          middlresponse.data = {}
          res.json(middlresponse)
        })
    } else {
      res.status(400)
      middlresponse.msg = `Missing or invalid body`
      middlresponse.status = 400
      middlresponse.data = {}
      res.json(middlresponse)
    }
  })

  /////////////// Update device attribute /////////////////
  app.post(`/updateAttr`, async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*')
    console.log('nextWatering:now')
    thingsboardApi
      .updateDeviceSharedAttr(global.tbTokens.token, entityId, 'now')
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


}
