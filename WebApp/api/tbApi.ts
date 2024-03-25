import axios from 'axios'
import { RegistrationFormData, ActivationInfo } from '~/types/tbApiTypes'

// create axios instance
const client = axios.create({
  baseURL: ''
})

const setupAxios = (baseURL: string) => {
  client.defaults.baseURL = baseURL
}

// try to login based on users creds
const login = (username: string, password: string): any => {
  return client.post(`/login`, {
    username: username,
    password: password
  })
}

const registration = (registrationInfo: RegistrationFormData) => {
  return client.post(`/createUser`, {
    email: registrationInfo.email,
    firstName: registrationInfo.firstName,
    lastName: registrationInfo.lastName
  })
}

const logout = (token: string) => {
  return client.post('/logout', {
    accessToken: token
  })
}

const activateUser = (activationInfo: ActivationInfo) => {
  return client.post(`/activateUser`, {
    activationInfo
  })
}

const getUser = (token: string) => {
  return client.get(`/user?accessToken=${token}`)
}

const getHistory = (startTs: number, endTs: number) => {
  return client.get(`/history?startTs=${startTs}&endTs=${endTs}`)
}

const getForecast = (startTs: number, endTs: number) => {
  return client.get(`/forecast?startTs=${startTs}&endTs=${endTs}`)
}

const getDashboardForecast = (startTs: number, endTs: number) => {
  return client.get(`/dashboardForecast?startTs=${startTs}&endTs=${endTs}`)
}

const updateTBWateringAttr = () => {
  return client.post(`/updateAttr`)
}

export default {
  setupAxios,
  login,
  registration,
  activateUser,
  logout,
  getUser,
  getHistory,
  getForecast,
  getDashboardForecast,
  updateTBWateringAttr
}
