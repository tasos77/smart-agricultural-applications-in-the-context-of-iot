import bodyParser from "body-parser";
import * as dotenv from "dotenv";
import cors from "cors";
import express from "express";
import thingsboardApi from "./api/thingsboardApi.js";
import regex from "./utils/regex.js";

dotenv.config();

const emailRegex = regex.validEmailRegex;

const port = process.env.PORT;
const domain = process.env.DOMAIN;
// try to get TB access token
const tbTokens = await thingsboardApi.login();

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

  app.post(`/activateUser`, async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    const activationInfo = {
      activationToken: req.body.userId,
      password: req.body.password,
    };

    let msg;

    try {
      if (
        activationInfo.hasOwnProperty("activationToken") &&
        activationInfo.hasOwnProperty("password") &&
        activationInfo.activationToken &&
        activationInfo.password
      ) {
        try {
          activationResult = await thingsboardApi
            .activateUser(tbTokens.token, activationInfo)
            .then(() => then);
          if (activationResult) {
            res.status(200);
            msg = `User activated!`;
          }
        } catch (e) {
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
        //&& registrationInfo.email.match(emailRegex)
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
  });
}
