export interface ThingsboardRepository {
  login: (username: string, password: string) => any
  logout: (accessToken: string) => any
  getUser: (accessToken: string) => any
  activateUser: (tenantToken: string, activationInfo: { activateToken: string, password: string }) => any
  createCustomer: (tenantToken: string, email: string) => Promise<string | Error>
  createUser: (tenantToken: string, customerId: string, registrationInfo: { email: string, firstName: string, lastName: string }) => any
  getTelemetryRange: (tenantToken: string, entityId: string, startTs: number, endTs: number, keys = 'temperature,humidity,rain,soilMoisture,uv') => any
  updateDeviceSharedAttribute: (tenantToken: string, deviceId: string, nextWatering: number) => any
}
