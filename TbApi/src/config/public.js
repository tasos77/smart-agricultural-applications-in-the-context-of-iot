import * as dotenv from 'dotenv'

dotenv.config()

export const config = {
  tbBaseUrl: process.env.TB_BASE_URL,
  port: process.env.PORT,
  domain: process.env.DOMAIN,
  tenantUsername: process.env.TENANT_USERNAME,
  tenantPassword: process.env.TENANT_PASSWORD,
  forecastAppUrl: process.env.FORECAST_APP_BASE_URL,
  entityId: process.env.ENTITY_ID
}
