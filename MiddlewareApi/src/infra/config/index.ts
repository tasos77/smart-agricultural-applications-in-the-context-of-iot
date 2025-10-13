import { type Config, configSchema } from './schema'

const config: Config = {
  thingsBoard: {
    baseUrl: process.env.TB_BASE_URL as string,
    port: process.env.PORT as string,
    domain: process.env.DOMAIN as string,
    tenantUsername: process.env.TENANT_USERNAME as string,
    tenantPassword: process.env.TENANT_PASSWORD as string,
    entityId: process.env.ENTITY_ID as string
  },
  forecastServer: {
    url: process.env.FORECAST_APP_BASE_URL as string
  },
  server: {
    port: process.env.SERVER_PORT as string
  }
}

export const conf = configSchema.parse(config)
