import axios from 'axios'
import type { LoggerRepository } from '../../../core/repositories/logger/repository'

interface ForecastApiRepositoryApiDeps {
  logger: LoggerRepository
  forecastServer: string
}

interface ForecastApiRepositoryApi {
  predict: (data: any) => any
}

export const api = (deps: ForecastApiRepositoryApiDeps): ForecastApiRepositoryApi => {
  const { logger, forecastServer } = deps

  const client = axios.create({
    baseURL: forecastServer,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  const predict = async (data: any) => {
    try {
      logger.info('Prediction started')
      return await client.post('/predict', data)
    } catch (e) {
      logger.error(`Failed to predict, reason: ${e.message}`)
      return e
    }
  }

  return { predict }
}
