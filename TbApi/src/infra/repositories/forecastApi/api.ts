import axios from "axios";
import type { LoggerRepository } from "../../../core/repositories/logger/repository";

interface ForecastApiRepositoryApiDeps {
  logger: LoggerRepository
  forecastServer: string
}

interface ForecastApiRepositoryApi {
  predict: (data: any) => any
}

export const api = (deps: ForecastApiRepositoryApiDeps): ForecastApiRepositoryApi => {
  const { logger, forecastServer } = deps;

  const client = axios.create({
    baseURL: forecastServer,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  const predict = async (data: any) => {
    try {
      const result = await client.post('/predict', data)
      logger.info('Prediction successful')
      return result.data
    } catch (error: any) {
      logger.error(`Failed to predict, reason: ${error.message}`)
      return error
    }
  }

  return { predict }
}
