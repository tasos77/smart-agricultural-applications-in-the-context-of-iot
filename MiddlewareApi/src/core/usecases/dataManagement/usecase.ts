import type { LoggerRepository } from '../../repositories/logger/repository'
import type { DataManagerService } from '../../services/dataManager/service'

interface DataManagementUseCaseDeps {
  logger: LoggerRepository
  dataManagerService: DataManagerService
  tenantToken: string
}

export interface DataManagementUsecase {
  fetchHistory: (startTs: number, endTs: number) => Promise<any>
  fetchForecast: (startTs: number, endTs: number) => Promise<any>
  getTrainData: (startTs: number, endTs: number) => Promise<any>
  wateringPolling: (tenantToken: string) => Promise<Error | undefined>
}

export const make = (deps: DataManagementUseCaseDeps): DataManagementUsecase => {
  const { logger, dataManagerService, tenantToken } = deps

  const fetchHistory = async (startTs: number, endTs: number) => {
    logger.info('Fetching history telemetry')
    return await dataManagerService.fetchHistoryTelemetries(tenantToken, startTs, endTs)
  }

  const fetchForecast = async (startTs: number, endTs: number) => {
    logger.info('Fetching forecast telemetry')
    return await dataManagerService.fetchForecastTelemetries(tenantToken, startTs, endTs)
  }

  const getTrainData = async (startTs: number, endTs: number) => {
    logger.info('Fetching train data')
    return await dataManagerService.getTrainData(tenantToken, startTs, endTs)
  }

  const wateringPolling = async (tenantToken: string) => {
    logger.info('Polling watering data')
    return await dataManagerService.wateringPolling(tenantToken)
  }

  return {
    fetchHistory,
    fetchForecast,
    getTrainData,
    wateringPolling,
  }
}
