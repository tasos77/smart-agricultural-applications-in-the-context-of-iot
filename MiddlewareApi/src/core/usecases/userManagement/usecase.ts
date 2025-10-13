import type { UserManagementService } from "../../services/userManager/service";

interface UserManagementUseCaseDeps {
  userManagerService: UserManagementService
}

export interface UserManagementUseCase {
  login: (email: string, password: string) => any
  activateUser: (tenantToken: string, activateToken: string, password: string) => any
  createUser: (tenantToken: string, email: string, firstName: string, lastName: string) => Promise<any>
  logout: (userToken: string) => any
  fetchUserInfo: (userToken: string) => any
}


export const make = (deps: UserManagementUseCaseDeps): UserManagementUseCase => {
  const { userManagerService } = deps;

  const login = (email: string, password: string) => {
    return userManagerService.login(email, password)
  }

  const activateUser = (tenantToken: string, activateToken: string, password: string) => {
    return userManagerService.activateUser(tenantToken, activateToken, password)
  }

  const createUser = (tenantToken: string, email: string, firstName: string, lastName: string): Promise<any> => {
    return userManagerService.createUser(tenantToken, email, firstName, lastName)
  }

  const logout = (userToken: string) => {
    return userManagerService.logout(userToken)
  }

  const fetchUserInfo = (userToken: string) => {
    return userManagerService.fetchUserInfo(userToken)
  }

  return {
    login,
    activateUser,
    createUser,
    logout,
    fetchUserInfo
  }
}
