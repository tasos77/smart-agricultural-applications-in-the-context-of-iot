import moment from 'moment'
import type { Config } from '../../../config/schema'
import { aggregateHistoryData, transformTBDataToTimeseriesForecastAppFormat, transformTimeseriesForecastAppToTBDataFormat } from '../../../utils/convertions'
import { pumpFunc } from '../../../utils/handlePump'
import type { ForecastApiRepository } from '../../repositories/forecastApi/repository'
import type { LoggerRepository } from '../../repositories/logger/repository'
import type { ThingsboardRepository } from '../../repositories/thingsboardApi/repository'

interface DataManagerDeps {
  logger: LoggerRepository
  thingsboardRepo: ThingsboardRepository
  forecastRepo: ForecastApiRepository
  config: Config
}

export const make = (deps: DataManagerDeps) => {
  const { logger, thingsboardRepo, forecastRepo, config } = deps

  const fetchHistoryTelemetries = async (tenantToken: string, startTs: number, endTs: number) => {
    try {
      const telemetries = (await thingsboardRepo.getTelemetryRange(tenantToken, config.thingsBoard.entityId, startTs, endTs)).data
      return aggregateHistoryData(telemetries)
    }
    catch (e) {
      logger.error('Error fetching history telemetries', e)
      return e
    }

  }

  const fetchForecastTelemetries = async (tenantToken: string, startTs: number, endTs: number) => {
    try {
      const telemetries = (await thingsboardRepo.getTelemetryRange(tenantToken, config.thingsBoard.entityId, startTs, endTs)).data
      const forecastAppFormatedTelemetries = transformTBDataToTimeseriesForecastAppFormat(telemetries)
      const predictedTelemetries = (await forecastRepo.predict(forecastAppFormatedTelemetries)).data
      return transformTimeseriesForecastAppToTBDataFormat(predictedTelemetries)
    } catch (e) {
      logger.error('Error fetching forecast telemetries', e)
      return e
    }
  }

  const getTrainData = async (tenantToken: string, startTs: number, endTs: number) => {
    try {
      const telemetries = (await thingsboardRepo.getTelemetryRange(tenantToken, config.thingsBoard.entityId, startTs, endTs)).data
      return transformTBDataToTimeseriesForecastAppFormat(telemetries)
    }
    catch (e) {
      logger.error('Error fetching train data', e)
      return e
    }
  }

  const wateringPolling = async (tenantToken: string) => {
    try {
      const startTs = moment()
        .subtract(1 * 24, 'minutes')
        .valueOf()
      const endTs = moment()
        .subtract(0 * 24, 'minutes')
        .valueOf()
      const telemetries = (await thingsboardRepo.getTelemetryRange(tenantToken, config.thingsBoard.entityId, startTs, endTs)).data
      const forecastAppFormatedTelemetries = transformTBDataToTimeseriesForecastAppFormat(telemetries)
      const predictedTelemetries = (await forecastRepo.predict(forecastAppFormatedTelemetries)).data
      const threshold = pumpFunc(predictedTelemetries)
      if (threshold) {
        logger.info('Forecast under upper threshold..!')
        const nextWatering = moment()
        logger.info('Updating device attribute')
        thingsboardRepo.updateDeviceSharedAttribute(tenantToken, config.thingsBoard.entityId, nextWatering.valueOf())
        logger.info('Device attribute updated')
      }
    } catch (e) {
      logger.error('Error on watering polling, reason', e)
      return e
    }
  }

  return {
    fetchHistoryTelemetries,
    fetchForecastTelemetries,
    getTrainData,
    wateringPolling,
  }
}
