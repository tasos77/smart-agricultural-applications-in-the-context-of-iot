import bodyParser from "body-parser";
import * as dotenv from "dotenv";
import cors from "cors";
import express from "express";
import thingsboardApi from "./api/thingsboardApi.js";

dotenv.config();

const port = process.env.PORT;
const domain = process.env.DOMAIN;
// try to get TB access token
const tbTokens = await thingsboardApi.login(
  process.env.TENANT_USERNAME,
  process.env.TENANT_PASSWORD
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

  app.post(`login`, async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    const loginInfo = {
      username: req.body.activationInfo.username,
      password: req.body.activationInfo.password,
    };
    let msg;
    try {
      if (
        loginInfo.hasOwnProperty("username") &&
        loginInfo.hasOwnProperty("password") &&
        loginInfo.username &&
        loginInfo.password
      ) {
        try {
          const loginResult = await thingsboardApi.login(
            tbTokens.token,
            loginInfo
          );
          console.log(loginResult);
          if (loginResult) {
            res.status(200);
            msg = `User activated!`;
          }
        } catch (e) {
          console.log(e.response.data);
          res.status(400);
          msg = `Activation failed!`;
        }
      } else {
        throw Error();
      }
    } catch (e) {
      res.status(400);
      msg = `Missing or invalid body!`;
    }
    res.json({ msg });
  });

  app.post(`/activateUser`, async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    const activationInfo = {
      activateToken: req.body.activationInfo.activateToken,
      password: req.body.activationInfo.password,
    };
    let msg;

    try {
      if (
        activationInfo.hasOwnProperty("activateToken") &&
        activationInfo.hasOwnProperty("password") &&
        activationInfo.activateToken &&
        activationInfo.password
      ) {
        try {
          const activationResult = await thingsboardApi.activateUser(
            tbTokens.token,
            activationInfo
          );
          console.log(activationResult);
          if (activationResult) {
            res.status(200);
            msg = `User activated!`;
          }
        } catch (e) {
          console.log(e.response.data);
          res.status(400);
          msg = `Activation failed!`;
        }
      } else {
        throw Error();
      }
    } catch (e) {
      res.status(400);
      msg = `Missing or invalid body!`;
    }
    res.json({ msg });
  });

  app.post(`/createUser`, async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    const registrationInfo = {
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    };

    let msg;

    try {
      if (
        registrationInfo.hasOwnProperty("email") &&
        registrationInfo.hasOwnProperty("firstName") &&
        registrationInfo.hasOwnProperty("lastName") &&
        registrationInfo.email &&
        registrationInfo.firstName &&
        registrationInfo.lastName
      ) {
        try {
          const customerId = await thingsboardApi.createCustomer(
            tbTokens.token,
            registrationInfo.email
          );
          if (customerId) {
            try {
              await thingsboardApi.createUser(
                tbTokens.token,
                registrationInfo,
                customerId
              );

              res.status(200);
              msg = `TB user created!`;
            } catch (e) {
              console.log(e);
              res.status(400);
              msg = `User creation failed!`;
            }
          }
        } catch (e) {
          res.status(400);
          msg = `Customer creation failed!`;
        }
      } else {
        throw Error();
      }
    } catch (e) {
      res.status(400);
      msg = `Missing or invalid body!`;
    }
    res.json({ msg });
  });
}
