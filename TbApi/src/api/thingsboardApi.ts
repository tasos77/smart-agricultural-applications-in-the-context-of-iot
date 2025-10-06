import axios from 'axios'
import { config } from '../config/public.js'

// create axios instance
const instance = axios.create({
  baseURL: config.tbBaseUrl
})
// try tb login
const login = (username: string, password: string) => {
  return instance.post('/auth/login', {
    username,
    password
  })
}

const logout = (accessToken: string) => {
  return instance.post(
    `/auth/logout`,
    {},
    {
      headers: {
        'X-Authorization': `${accessToken}`
      }
    }
  )
}

const getUser = (accessToken: string) => {
  return instance.get('/auth/user', {
    headers: {
      'X-Authorization': `${accessToken}`
    }
  })
}

const activateUser = (token: string, activationInfo: { activateToken: string, password: string }) => {
  console.log(activationInfo)
  return instance.post(
    '/noauth/activate?sendActivationMail=false',
    {
      activateToken: activationInfo.activateToken,
      password: activationInfo.password
    },
    {
      headers: {
        'X-Authorization': `Bearer ${token}`
      }
    }
  )
}

const createCustomer = (token: string, email: string) => {
  return instance.post(
    '/customer',
    {
      title: email,
      email
    },
    {
      headers: {
        'X-Authorization': `Bearer ${token}`
      }
    }
  )
}

const createUser = (token: string, registrationInfo: { email: string, firstName: string, lastName: string }, customerId: string) => {
  return instance.post(
    '/user',
    {
      customerId: {
        id: customerId,
        entityType: 'CUSTOMER'
      },
      email: registrationInfo.email,
      authority: 'CUSTOMER_USER',
      firstName: registrationInfo.firstName,
      lastName: registrationInfo.lastName
    },
    {
      params: {
        sendActivationMail: true
      },
      headers: {
        'X-Authorization': `Bearer ${token}`
      }
    }
  )
}

const getTelemetryRange = (token: string, entityId: string, startTs: number, endTs: number, keys = 'temperature,humidity,rain,soilMoisture,uv') => {
  return instance.get(`/plugins/telemetry/DEVICE/${entityId}/values/timeseries?keys=${keys}&endTs=${endTs}&startTs=${startTs}&orderBy=ASC&limit=99999&agg=NONE`, {
    headers: {
      'X-Authorization': `Bearer ${token}`
    }
  })
}

const updateDeviceSharedAttr = (token: string, deviceId: string, nextWatering: number) => {
  return instance.post(
    `plugins/telemetry/DEVICE/${deviceId}/attributes/SHARED_SCOPE`,
    {
      watering: nextWatering
    },
    {
      headers: {
        'X-Authorization': `Bearer ${token}`
      }
    }
  )
}

export default {
  login,
  activateUser,
  createCustomer,
  createUser,
  logout,
  getUser,
  getTelemetryRange,
  updateDeviceSharedAttr
}
