import axios from "axios";
import * as dotenv from "dotenv";

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

const activateUser = (activationInfo) => {
  return instance.post(
    "/noauth/activate",
    {
      activationToken: activationInfo.activationToken,
      password: activationInfo.password,
    },
    {
      params: {
        sendActivationMail: false,
      },
    }
  );
};

export default {
  login() {
    return login();
  },
  activateUser() {
    return activateUser(activationToken, password);
  },
};
