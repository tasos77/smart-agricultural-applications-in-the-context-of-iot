import { z } from 'zod'

const telemetryRangeQuerySchema = z.object({
  startTs: z.number(),
  endTs: z.number()
})

export { telemetryRangeQuerySchema }
