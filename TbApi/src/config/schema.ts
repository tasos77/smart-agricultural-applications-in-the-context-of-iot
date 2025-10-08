import { z } from 'zod';

const thingsBoardSchema = z.object({
  baseUrl: z.string(),
  port: z.string(),
  domain: z.string(),
  tenantUsername: z.string(),
  tenantPassword: z.string(),
  entityId: z.string()
})

const forecastServer = z.object({
  url: z.string()
})

export const configSchema = z.object({
  thingsBoard: thingsBoardSchema,
  forecastServer: forecastServer
})

export type Config = z.infer<typeof configSchema>;
