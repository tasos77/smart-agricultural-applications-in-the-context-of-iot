import type { Config } from "../../../config/schema"
import type { LoggerRepository } from "../../../core/repositories/logger/repository"

interface ThingsboardRepositoryDeps {
  config: Config
  logger: LoggerRepository
}

interface ThingsboardRepository {
  login: (username: string, password: string) => any
  logout: (accessToken: string) => any
  getUser: (accessToken: string) => any
  activateUser: (tenantToken: string, activationInfo: { activateToken: string, password: string }) => any
  createCustomer: (tenantToken: string, email: string) => any
  createUser: (tenantToken: string, customerId: string, registrationInfo: { email: string, firstName: string, lastName: string }) => any
  getTelemetryRange: (tenantToken: string, entityId: string, startTs: number, endTs: number, keys = 'temperature,humidity,rain,soilMoisture,uv') => any
  updateDeviceSharedAttribute: (tenantToken: string, deviceId: string, nextWatering: number) => any
}


export const make = (deps: ThingsboardRepositoryDeps): ThingsboardRepository => {
  const { logger } = deps


  const login = () => { }

  const logout = () => { }

  const getUser = () => { }

  const activateUser = () => { }

  const createCustomer = () => { }

  const createUser = () => { }

  const getTelemetryRange = () => { }

  const updateDeviceSharedAttribute = () => { }

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
