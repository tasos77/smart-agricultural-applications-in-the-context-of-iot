import axios from "axios";
import { tokensAuthStore } from "../stores/auth";
import { RegistrationFormData, ActivationInfo } from "~~/types/tbApiTypes";
// init store instance
const authStore = tokensAuthStore();

// create axios instance
const client = axios.create({
  baseURL: "http://localhost:3005",
});
// // try to refresh tokens , if succ return new tokens else return null
// const refreshToken = () => {
//   // get refresh token from store
//   const refreshToken = authStore.getLocalRefreshToken();
//   // return result
//   return (
//     client
//       .post(`api/v1/auth/refresh`, {
//         refreshToken: refreshToken,
//       })
//       // on succ set new tokens to store
//       .then((newTokens) => {
//         authStore.setLocalTokens(newTokens);
//       })
//       // on failure remove all tokens from store , navigate to login page
//       .catch(() => {
//         authStore.removeTokens();
//         navigateTo("/login");
//       })
//   );
// };

// // add token from store for every request
// const requestHandler = (request) => {
//   request.headers.Authorization = authStore.getLocalToken();
//   return request;
// };
// // return data for every response
// const responseHandler = (response) => {
//   return response.data;
// };
// // handle error response
// const errorHandler = (error) => {
//   // get prev request config
//   const originalRequest = error.config;
//   // check if any unauth error from wxm api
//   if (
//     error.response.status === 401 &&
//     error.response.config.baseURL === "http:localhost:9090" &&
//     !originalRequest._retry
//   ) {
//     // set retry to true
//     originalRequest._retry = true;
//     // try to refresh tokens
//     return refreshToken()
//       .then(() => {
//         return client(originalRequest);
//       })
//       .catch(() => {
//         return Promise.reject(error);
//       });
//   }
// };

// // propagate respectively request and error
// client.interceptors.request.use(
//   (request) => requestHandler(request),
//   (error) => errorHandler(error)
// );
// // propagate respectively request and error
// client.interceptors.response.use(
//   (response) => responseHandler(response),
//   (error) => errorHandler(error)
// );

// try to login based on users creds
const login = (username: string, password: string): any => {
  return client.post(`/login`, {
    username: username,
    password: password,
  });
};

const registration = (registrationInfo: RegistrationFormData) => {
  return client.post(`/createUser`, {
    email: registrationInfo.email,
    firstName: registrationInfo.firstName,
    lastName: registrationInfo.lastName,
  });
};

const activateUser = (activationInfo: ActivationInfo) => {
  console.log(activationInfo);

  return client.post(`/activateUser`, {
    activationInfo,
  });
};

// // try to get users devices
// const getDevices = () => {
//   return client.get(`api/v1/me/devices`);
// };

export default { login, registration, activateUser };
