import axios from "axios";
import { config } from "../config/public.js";

// create axios instance
const instance = axios.create({
  baseURL: config.tbBaseUrl,
});
// try tb login
const login = (username, password) => {
  return instance.post("/auth/login", {
    username,
    password,
  });
};

const activateUser = (token, activationInfo) => {
  console.log(activationInfo);
  return instance.post(
    "/noauth/activate?sendActivationMail=false",
    {
      activateToken: activationInfo.activateToken,
      password: activationInfo.password,
    },
    {
      headers: {
        "X-Authorization": `Bearer ${token}`,
      },
    }
  );
};

// try to create tb customer and set clerk's userId as server attribute
const createCustomer = (token, email) => {
  return instance.post(
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
  );
};

const createUser = (token, registrationInfo, customerId) => {
  return instance.post(
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
  );
};

export default {
  login(username, password) {
    return login(username, password);
  },
  activateUser(token, activationInfo) {
    return activateUser(token, activationInfo);
  },
  createCustomer(token, email) {
    return createCustomer(token, email);
  },
  createUser(token, registrationInfo, customerId) {
    return createUser(token, registrationInfo, customerId);
  },
};
