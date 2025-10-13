import type { Config } from '../../../config/schema'
import type { ForecastApiRepository } from '../../../core/repositories/forecastApi/repository'
import type { LoggerRepository } from '../../../core/repositories/logger/repository'
import { api } from './api'

export interface ForecastApiRepositoryDeps {
  logger: LoggerRepository
  config: Config
}

export const make = (deps: ForecastApiRepositoryDeps): ForecastApiRepository => {
  const { logger, config } = deps

  const forecastApi = api({ logger, forecastServer: config.forecastServer.url })

  const predict = (data: any) => {
    return forecastApi.predict(data)
  }

  return { predict }
}
