import { Hono } from "hono"
import type { DataManagementUsecase } from "../../../../core/usecases/dataManagement/usecase"
import { zValidator } from "../requestSchemas/validator-wrapper"
import { telemetryRangeQuerySchema } from "../requestSchemas/weather"

interface WeatherRouteDeps {
  dataManagementUsecase: DataManagementUsecase
}

export const make = (deps: WeatherRouteDeps): Hono => {
  const app = new Hono()
  const { dataManagementUsecase } = deps

  app.get('/history', zValidator('query', telemetryRangeQuerySchema), async (c) => {
    const { startTs, endTs } = c.req.valid('query')
    const history = await dataManagementUsecase.fetchHistory(startTs, endTs)
    if (history instanceof Error) {
      c.status(400)
      return c.json({ msg: 'Weather history not found', status: 400, data: {} })
    }
    c.status(200)
    return c.json({ msg: 'Weather history retrieved', status: 200, data: history })
  })

  app.get('/forecast', zValidator('query', telemetryRangeQuerySchema), async (c) => {
    const { startTs, endTs } = c.req.valid('query')
    const forecast = await dataManagementUsecase.fetchForecast(startTs, endTs)
    if (forecast instanceof Error) {
      c.status(400)
      return c.json({ msg: 'Weather forecast not found', status: 400, data: {} })
    }
    c.status(200)
    return c.json({ msg: 'Weather forecast retrieved', status: 200, data: forecast })
  })

  app.get('/train-data', zValidator('query', telemetryRangeQuerySchema), async (c) => {
    const { startTs, endTs } = c.req.valid('query')
    const trainData = await dataManagementUsecase.getTrainData(startTs, endTs)
    if (trainData instanceof Error) {
      c.status(400)
      return c.json({ msg: 'Weather train data not found', status: 400, data: {} })
    }
    c.status(200)
    return c.json({ msg: 'Weather train data retrieved', status: 200, data: trainData })
  })

  return app
}
