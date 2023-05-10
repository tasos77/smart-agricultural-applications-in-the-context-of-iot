import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import thingsboardApi from "./api/thingsboardApi.js";
import { config } from "./config/public.js";

const port = config.port;
const domain = config.domain;
// try to get TB access token
const tbTokens = await thingsboardApi.login(
  config.tenantUsername,
  config.tenantPassword
);

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
}
