import type { LoggerRepository } from '../../../core/repositories/logger/repository'
import type { ThingsboardRepository } from '../../../core/repositories/thingsboardApi/repository'
import type { Config } from '../../config/schema'
import { api, type ThingsboardApiApi } from './api'

interface ThingsboardRepositoryDeps {
  config: Config
  logger: LoggerRepository
}

export const make = (deps: ThingsboardRepositoryDeps): ThingsboardRepository => {
  const { logger, config } = deps

  const thingsboardApi: ThingsboardApiApi = api({ logger, thingsboardBaseUrl: config.thingsBoard.baseUrl })

  const login = (username: string, password: string) => {
    return thingsboardApi.login(username, password)
  }

  const logout = (accessToken: string) => {
    return thingsboardApi.logout(accessToken)
  }

  const getUser = (accessToken: string) => {
    return thingsboardApi.getUser(accessToken)
  }

  const activateUser = (tenantToken: string, activationInfo: { activateToken: string; password: string }) => {
    return thingsboardApi.activateUser(tenantToken, activationInfo)
  }

  const createCustomer = (tenantToken: string, email: string): Promise<string | Error> => {
    return thingsboardApi.createCustomer(tenantToken, email)
  }

  const createUser = (tenantToken: string, customerId: string, registrationInfo: { email: string; firstName: string; lastName: string }) => {
    return thingsboardApi.createUser(tenantToken, customerId, registrationInfo)
  }

  const getTelemetryRange = (tenantToken: string, entityId: string, startTs: number, endTs: number, keys = 'temperature,humidity,rain,soilMoisture,uv') => {
    return thingsboardApi.getTelemetryRange(tenantToken, entityId, startTs, endTs, keys)
  }

  const updateDeviceSharedAttribute = (tenantToken: string, deviceId: string, nextWatering: number) => {
    return thingsboardApi.updateDeviceSharedAttribute(tenantToken, deviceId, nextWatering)
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
