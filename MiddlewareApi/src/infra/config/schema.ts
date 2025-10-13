import { z } from 'zod';

const thingsBoardSchema = z.object({
  baseUrl: z.string(),
  port: z.string(),
  domain: z.string(),
  tenantUsername: z.string(),
  tenantPassword: z.string(),
  entityId: z.string()
})

const forecastServerSchema = z.object({
  url: z.string()
})

const serverSchema = z.object({
  port: z.string()
})

export const configSchema = z.object({
  thingsBoard: thingsBoardSchema,
  forecastServer: forecastServerSchema,
  server: serverSchema,
})

export type Config = z.infer<typeof configSchema>;
