import { calcSingleIcon } from '../../../utils/commonTools'
import * as wsTelemetries from '../../entities/wsTbTelemetries/entity'
import type { LoggerRepository } from '../../repositories/logger/repository'

interface WsTelemetryDataConverterServiceDeps {
  logger: LoggerRepository
}

export interface WsTelemetryDataConverterService {
  convert: (data: any) => wsTelemetries.WsTbTelemetries | Error
}

export const make = (deps: WsTelemetryDataConverterServiceDeps): WsTelemetryDataConverterService => {
  const { logger } = deps

  const convert = (data: any): wsTelemetries.WsTbTelemetries | Error => {
    logger.info('Converting data')
    const posibleTelemetries = {
      timestamp: data.temperature[0][0],
      temperature: parseFloat(data.temperature[0][1]),
      humidity: parseFloat(data.humidity[0][1]),
      rain: parseFloat(data.rain[0][1]),
      soilMoisture: parseFloat(data.soilMoisture[0][1]),
      uv: parseFloat(data.uv[0][1]),
      icon: calcSingleIcon(parseFloat(data.rain[0][1]), data.temperature[0][0])
    }
    const result = wsTelemetries.from(posibleTelemetries)
    if (result instanceof Error) {
      logger.error(`Error converting data, reason:${result.message}`)
    }
    return result
  }
  return {
    convert
  }
}
