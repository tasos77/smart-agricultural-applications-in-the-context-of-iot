import axios from 'axios'
import type { LoggerRepository } from '../../../core/repositories/logger/repository'

interface ThingsboardApiApiDeps {
  logger: LoggerRepository
  thingsboardBaseUrl: string
}

export interface ThingsboardApiApi {
  login: (username: string, password: string) => any
  logout: (accessToken: string) => any
  getUser: (accessToken: string) => any
  activateUser: (
    tenantToken: string,
    activationInfo: { activateToken: string; password: string }
  ) => any
  createCustomer: (tenantToken: string, email: string) => any
  createUser: (
    tenantToken: string,
    customerId: string,
    registrationInfo: { email: string; firstName: string; lastName: string }
  ) => any
  getTelemetryRange: (
    tenantToken: string,
    entityId: string,
    startTs: number,
    endTs: number,
    keys = 'temperature,humidity,rain,soilMoisture,uv'
  ) => any
  updateDeviceSharedAttribute: (tenantToken: string, deviceId: string, nextWatering: number) => any
}

export const api = (deps: ThingsboardApiApiDeps): ThingsboardApiApi => {
  const { logger, thingsboardBaseUrl } = deps

  const client = axios.create({
    baseURL: thingsboardBaseUrl
  })

  const login = async (username: string, password: string) => {
    try {
      logger.info(`Logging in as ${username}`)
      return await client.post('/auth/login', {
        username,
        password
      })
    } catch (e) {
      logger.error(`Failed to login, reason: ${e.message}`)
      return e
    }
  }

  const logout = async (accessToken: string) => {
    try {
      logger.info(`Logging out`)
      return await client.post(`/auth/logout`, {},
        {
          headers: {
            'X-Authorization': `${accessToken}`
          }
        }
      )
    } catch (e) {
      logger.error(`Failed to logout, reason: ${e.message}`)
      return e
    }
  }

  const getUser = (accessToken: string) => {
    return client.get('/auth/user', {
      headers: {
        'X-Authorization': `${accessToken}`
      }
    })
  }

  const activateUser = (token: string, activationInfo: { activateToken: string, password: string }) => {
    console.log(activationInfo)
    return client.post(
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
    return client.post(
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
    return client.post(
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
    return client.get(`/plugins/telemetry/DEVICE/${entityId}/values/timeseries?keys=${keys}&endTs=${endTs}&startTs=${startTs}&orderBy=ASC&limit=99999&agg=NONE`, {
      headers: {
        'X-Authorization': `Bearer ${token}`
      }
    })
  }

  const updateDeviceSharedAttr = (token: string, deviceId: string, nextWatering: number) => {
    return client.post(
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
  return {
    login,
    activateUser,
    createCustomer,
    createUser,
    logout,
    getUser,
    getTelemetryRange,
    updateDeviceSharedAttr
  }

}
