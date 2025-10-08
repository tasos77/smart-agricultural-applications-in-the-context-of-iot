import type { WsTbTelemetries } from '../../entities/wsTbTelemetries/entity'
import type { LoggerRepository } from '../../repositories/logger/repository'
import type { PumpStateManagerService } from '../../services/pumpStateManager'
import type { WsTelemetryDataConverterService } from '../../services/wsTelemetryDataConverter'

interface WebsocketDataFactoryUsecaseDeps {
  logger: LoggerRepository
  wsTelemetryDataConverterService: WsTelemetryDataConverterService
  pumpStateManagerService: PumpStateManagerService
}

export interface WebsocketDataFactoryUsecase {
  parseRawDataToTbTelemetries: (rawData: any) => WsTbTelemetries | Error,
  managePumpUpdate: (update: any) => string | null
}

export const make = (deps: WebsocketDataFactoryUsecaseDeps): WebsocketDataFactoryUsecase => {
  const { logger, wsTelemetryDataConverterService, pumpStateManagerService } = deps

  const parseRawDataToTbTelemetries = (rawData: any): WsTbTelemetries | Error => {
    logger.info('Parsing raw data to telemetry')
    const result = wsTelemetryDataConverterService.convert(rawData)
    if (result instanceof Error) {
      logger.error(`Error parsing raw data to telemetry, reason: ${result.message}`)
    }
    return result
  }

  const managePumpUpdate = (update: any): string | null => {
    logger.info('Parsing pump update ')
    return pumpStateManagerService.parseUpdateMessage(update)
  }

  return {
    parseRawDataToTbTelemetries,
    managePumpUpdate
  }
}
