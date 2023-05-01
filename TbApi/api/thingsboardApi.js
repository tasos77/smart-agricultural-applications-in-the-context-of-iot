import axios from "axios";
import * as dotenv from "dotenv";
import { response } from "express";

dotenv.config();

// create axios instance
const instance = axios.create({
  baseURL: process.env.TB_BASE_URL,
});
// try tb login
const login = () => {
  return (
    instance
      .post("/auth/login", {
        username: process.env.TENANT_USERNAME,
        password: process.env.TENANT_PASSWORD,
      })
      // return tokens on succ or null on failure
      .then((response) => response.data)
      .catch((e) => {
        console.log(e.response);
        return null;
      })
  );
};

const activateUser = (token, activationInfo) => {
  console.log(activationInfo);
  return instance.post(
    "/noauth/activate",
    {
      activateToken: activationInfo.activateToken,
      password: activationInfo.password,
    },
    {
      params: {
        sendActivationMail: false,
      },
      headers: {
        "X-Authorization": `Bearer ${token}`,
      },
    }
  );
};

// try to create tb customer and set clerk's userId as server attribute
const createCustomer = (token, email) => {
  return instance
    .post(
      "/customer",
      {
        title: email,
        email,
      },
      {
        headers: {
          "X-Authorization": `Bearer ${token}`,
        },
      }
    )
    .then((response) => {
      return response.data.id.id;
    })
    .catch((e) => {
      console.log(e.response.data);
      return null;
    });
};

const createUser = (token, registrationInfo, customerId) => {
  return instance
    .post(
      "/user",
      {
        customerId: {
          id: customerId,
          entityType: "CUSTOMER",
        },
        email: registrationInfo.email,
        authority: "CUSTOMER_USER",
        firstName: registrationInfo.firstName,
        lastName: registrationInfo.lastName,
      },
      {
        params: {
          sendActivationMail: true,
        },
        headers: {
          "X-Authorization": `Bearer ${token}`,
        },
      }
    )
    .then((response) => response.data);
};

export default {
  login() {
    return login();
  },
  activateUser() {
    return activateUser(activationToken, password);
  },
  createCustomer(token, email) {
    return createCustomer(token, email);
  },
  createUser(token, registrationInfo, customerId) {
    return createUser(token, registrationInfo, customerId);
  },
};
