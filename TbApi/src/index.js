import bodyParser from "body-parser";
import cors from "cors";
import express, { response } from "express";
import thingsboardApi from "./api/thingsboardApi.js";
import { config } from "./config/public.js";
import WebSocket from "ws";
import { WebSocketServer } from "ws";

const port = config.port;
const domain = config.domain;
// try to get TB access token
const tbTokens = await thingsboardApi
  .login(config.tenantUsername, config.tenantPassword)
  .then((response) => response.data)
  .catch((e) => {
    console.log("Failed to get TB tokens..!");
  });

if (tbTokens) {
  // create express application
  const app = express();
  // listen port 8081
  const server = app.listen(port, function () {
    const host = server.address().address;
    const port = server.address().port;
    console.log(`Example app listening at http://${domain}:${port}`);
  });

  // tell express to use body-parser's JSON parsing
  app.use(bodyParser.json());
  // avoid CORS errors
  app.use(
    cors({
      origin: "*",
    })
  );

  app.post(`/login`, async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    const loginInfo = {
      username: req.body.username,
      password: req.body.password,
    };
    let middlresponse = {
      msg: "",
      status: null,
      data: {},
    };
    if (
      loginInfo.hasOwnProperty("username") &&
      loginInfo.hasOwnProperty("password") &&
      loginInfo.username &&
      loginInfo.password
    ) {
      thingsboardApi
        .login(loginInfo.username, loginInfo.password)
        .then((tbRes) => {
          res.status(200);
          middlresponse.msg = `Succ login`;
          middlresponse.status = 200;
          middlresponse.data = tbRes.data;
          res.json(middlresponse);
        })
        .catch((e) => {
          res.status(400);
          middlresponse.msg = e.response.data.message;
          middlresponse.status = 400;
          res.json(middlresponse);
        });
    } else {
      res.status(400);
      middlresponse.msg = `Missing or invalid body!`;
      middlresponse.status = 400;
      res.json(middlresponse);
    }
  });

  app.post(`/activateUser`, async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    const activationInfo = {
      activateToken: req.body.activationInfo.activateToken,
      password: req.body.activationInfo.password,
    };
    let middlresponse = {
      msg: "",
      status: null,
      data: {},
    };

    if (
      activationInfo.hasOwnProperty("activateToken") &&
      activationInfo.hasOwnProperty("password") &&
      activationInfo.activateToken &&
      activationInfo.password
    ) {
      thingsboardApi
        .activateUser(tbTokens.token, activationInfo)
        .then(() => {
          res.status(200);
          middlresponse.msg = `User activated!`;
          middlresponse.status = 200;
          res.json(middlresponse);
        })
        .catch((e) => {
          res.status(400);
          middlresponse.msg = `Activation failed!`;
          middlresponse.status = 400;
          res.json(middlresponse);
        });
    } else {
      res.status(400);
      middlresponse.msg = `Missing or invalid body!`;
      middlresponse.status = 400;
      res.json(middlresponse);
    }
  });

  app.post(`/createUser`, async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    const registrationInfo = {
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    };

    let middlresponse = {
      msg: "",
      status: null,
      data: {},
    };

    if (
      registrationInfo.hasOwnProperty("email") &&
      registrationInfo.hasOwnProperty("firstName") &&
      registrationInfo.hasOwnProperty("lastName") &&
      registrationInfo.email &&
      registrationInfo.firstName &&
      registrationInfo.lastName
    ) {
      await thingsboardApi
        .createCustomer(tbTokens.token, registrationInfo.email)
        .then(async (response) => {
          const customerId = response.data.id.id;
          await thingsboardApi
            .createUser(tbTokens.token, registrationInfo, customerId)
            .then(() => {
              res.status(200);
              middlresponse.msg = `TB user created!`;
              middlresponse.status = 200;
              res.json(middlresponse);
            })
            .catch((e) => {
              res.status(400);
              middlresponse.msg = `User creation failed!`;
              middlresponse.status = 400;
              res.json(middlresponse);
            });
        })
        .catch((e) => {
          res.status(400);
          middlresponse.msg = `Customer creation failed!`;
          middlresponse.status = 400;
          res.json(middlresponse);
        });
    } else {
      res.status(400);
      middlresponse.msg = `Missing or invalid body!`;
      middlresponse.status = 400;
      res.json(middlresponse);
    }
  });

  ////////////////////// init socket //////////////////////

  const wss = new WebSocketServer({ port: 8080 });
  wss.on("connection", function connection(ws) {
    var token = tbTokens.token;
    var entityId = "e5236870-5aca-11ed-8a9a-75998db067ac";

    var webSocket = new WebSocket(
      "ws://localhost:9090/api/ws/plugins/telemetry?token=" + token
    );

    if (entityId === "YOUR_DEVICE_ID") {
      console.log("Invalid device id!");
      webSocket.close();
    }

    if (token === "YOUR_JWT_TOKEN") {
      console.log("Invalid JWT token!");
      webSocket.close();
    }

    webSocket.on("error", console.error);

    webSocket.onopen = function () {
      var object = {
        tsSubCmds: [
          {
            entityType: "DEVICE",
            entityId: entityId,
            scope: "LATEST_TELEMETRY",
            cmdId: 10,
          },
        ],
        historyCmds: [],
        attrSubCmds: [],
      };
      var data = JSON.stringify(object);
      webSocket.send(data);
      console.log("Message is sent: " + data);
    };

    webSocket.onmessage = function (event) {
      let parsedRawTBtelemetries = JSON.parse(event.data).data;

      let formatedTbTelemetries = {
        timestamp: parsedRawTBtelemetries.temperature[0][0],
        temperature: parseFloat(parsedRawTBtelemetries.temperature[0][1]),
        humidity: parseFloat(parsedRawTBtelemetries.humidity[0][1]),
        rain: parseFloat(parsedRawTBtelemetries.rain[0][1]),
        soilMoisture: parseFloat(parsedRawTBtelemetries.soilMoisture[0][1]),
        uv: parseFloat(parsedRawTBtelemetries.uv[0][1]),
      };

      console.log(formatedTbTelemetries);
      ws.send(JSON.stringify(formatedTbTelemetries));
    };

    webSocket.onclose = function (event) {
      console.log("Connection is closed!");
    };

    ws.on("error", console.error);

    ws.on("message", function message(data) {
      console.log("received: %s", data);
    });
  });
}
