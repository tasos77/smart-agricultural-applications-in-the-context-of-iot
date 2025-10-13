import type { LoggerRepository } from "../../repositories/logger/repository";

interface PumpStateManagerServiceDeps {
  logger: LoggerRepository
}
export interface PumpStateManagerService {
  parseUpdateMessage: (message: any) => string | null;
}

export const make = (deps: PumpStateManagerServiceDeps): PumpStateManagerService => {

  const { logger } = deps

  const parseUpdateMessage = (message: any) => {
    logger.info('Parsing update message')
    return message?.update
      ? message?.update[0]?.latest?.ATTRIBUTE?.pump_state?.value
      : null
  }

  return {
    parseUpdateMessage
  }
}
