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
  activateUser: (tenantToken: string, activationInfo: { activateToken: string; password: string }) => any
  createCustomer: (tenantToken: string, email: string) => Promise<string | Error>
  createUser: (tenantToken: string, customerId: string, registrationInfo: { email: string; firstName: string; lastName: string }) => any
  getTelemetryRange: (tenantToken: string, entityId: string, startTs: number, endTs: number, keys = 'temperature,humidity,rain,soilMoisture,uv') => any
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
      return await client.post(`/auth/logout`,
        {},
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

  const getUser = async (accessToken: string) => {
    try {
      logger.info(`Getting user`)
      return await client.get('/auth/user', {
        headers: {
          'X-Authorization': `${accessToken}`
        }
      })
    } catch (e) {
      logger.error(`Failed to get user, reason: ${e.message}`)
      return e
    }
  }

  const activateUser = async (token: string, activationInfo: { activateToken: string; password: string }) => {
    try {
      logger.info(`Activating user`)
      return await client.post('/noauth/activate?sendActivationMail=false',
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
    } catch (e) {
      logger.error(`Failed to activate user, reason: ${e.message}`)
      return e
    }
  }

  const createCustomer = async (token: string, email: string): Promise<string | Error> => {
    try {
      logger.info(`Creating customer`)
      return (await client.post('/customer',
        {
          title: email,
          email
        },
        {
          headers: {
            'X-Authorization': `Bearer ${token}`
          }
        }
      )).data.id.id
    } catch (e) {
      logger.error(`Failed to create customer, reason: ${e.message}`)
      return e as Error
    }
  }

  const createUser = async (token: string, customerId: string, registrationInfo: { email: string; firstName: string; lastName: string }) => {
    try {
      logger.info(`Creating user`)
      return await client.post('/user',
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
    } catch (e) {
      logger.error(`Failed to create user, reason: ${e.message}`)
      return e
    }
  }

  const getTelemetryRange = async (token: string, entityId: string, startTs: number, endTs: number, keys = 'temperature,humidity,rain,soilMoisture,uv') => {
    try {
      logger.info(`Getting telemetry range`)
      return await client.get(`/plugins/telemetry/DEVICE/${entityId}/values/timeseries?keys=${keys}&endTs=${endTs}&startTs=${startTs}&orderBy=ASC&limit=99999&agg=NONE`, {
        headers: {
          'X-Authorization': `Bearer ${token}`
        }
      })
    } catch (e) {
      logger.error(`Failed to get telemetry range, reason: ${e.message}`)
      return e
    }
  }

  const updateDeviceSharedAttribute = async (token: string, deviceId: string, nextWatering: number) => {
    try {
      logger.info(`Updating device shared attribute`)
      return await client.post(
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
    } catch (e) {
      logger.error(`Failed to update device shared attribute, reason: ${e.message}`)
      return e
    }
  }

  return {
    login,
    logout,
    getUser,
    activateUser,
    createCustomer,
    createUser,
    getTelemetryRange,
    updateDeviceSharedAttribute
  }
}
