import { z } from 'zod'

const wbTbTelemetriesSchema = z.object({
  timestamp: z.number(),
  temperature: z.number(),
  humidity: z.number(),
  rain: z.number(),
  soilMoisture: z.number(),
  uv: z.number(),
  icon: z.string(),
})

export type WsTbTelemetries = z.infer<typeof wbTbTelemetriesSchema>

export const from = (data: any): WsTbTelemetries | Error => {
  try {
    return wbTbTelemetriesSchema.parse(data)
  } catch (error) {
    return new Error('Malformed raw data')
  }
}
