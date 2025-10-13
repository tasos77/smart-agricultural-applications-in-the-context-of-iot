import type { LoggerRepository } from '../../repositories/logger/repository'
import type { ThingsboardRepository } from '../../repositories/thingsboardApi/repository'

interface UserManagementServiceDeps {
  logger: LoggerRepository
  thingsboardRepo: ThingsboardRepository
}

export interface UserManagementService {
  login: (email: string, password: string) => any
  activateUser: (tenantToken: string, activateToken: string, password: string) => any
  createUser: (tenantToken: string, email: string, firstName: string, lastName: string) => Promise<any>
  logout: (userToken: string) => any
  fetchUserInfo: (userToken: string) => any
}

export const make = (deps: UserManagementServiceDeps): UserManagementService => {
  const { logger, thingsboardRepo } = deps

  const login = (email: string, password: string) => {
    logger.info(`Logging as ${email}`)
    return thingsboardRepo.login(email, password)
  }

  const activateUser = (tenantToken: string, activateToken: string, password: string) => {
    logger.info(`Activating user with token ${activateToken}`)
    return thingsboardRepo.activateUser(tenantToken, { activateToken, password })
  }

  const createUser = async (tenantToken: string, email: string, firstName: string, lastName: string): Promise<any> => {
    logger.info(`Creating user ${email}`)
    const customerId = await thingsboardRepo.createCustomer(tenantToken, email)
    if (customerId instanceof Error) {
      return customerId
    } else {
      return thingsboardRepo.createUser(tenantToken, customerId, { email, firstName, lastName })
    }
  }

  const logout = (userToken: string) => {
    logger.info(`Logging out user ${userToken}`)
    return thingsboardRepo.logout(userToken)
  }

  const fetchUserInfo = (userToken: string) => {
    logger.info(`Fetching user info for ${userToken}`)
    return thingsboardRepo.getUser(userToken)
  }

  return {
    login,
    activateUser,
    createUser,
    logout,
    fetchUserInfo
  }
}
