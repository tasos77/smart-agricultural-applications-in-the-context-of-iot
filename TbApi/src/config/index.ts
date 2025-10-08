import { type Config, configSchema } from './schema'

const config: Config = {
  thingsBoard: {
    baseUrl: process.env.TB_BASE_URL,
    port: process.env.PORT,
    domain: process.env.DOMAIN,
    tenantUsername: process.env.TENANT_USERNAME,
    tenantPassword: process.env.TENANT_PASSWORD,
    entityId: process.env.ENTITY_ID
  },
  forecastServer: {
    url: process.env.FORECAST_APP_BASE_URL
  }
}

export const conf = configSchema.parse(config)
