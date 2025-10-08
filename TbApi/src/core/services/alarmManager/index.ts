import { convertAlarmEvent } from '../../../utils/convertAlarmEvent';
import type { LoggerRepository } from "../../repositories/logger/repository";

interface AlarmManagerServiceDeps {
  logger: LoggerRepository
}

export interface AlarmManagerService {
  parseAlarmMessage: (message: any) => { measurement: string, flag: number } | null
}


export const make = (deps: AlarmManagerServiceDeps): AlarmManagerService => {
  const { logger } = deps;

  const parseAlarmMessage = (message: any): { measurement: string, flag: number } | null => {
    logger.info('Parsing alarm message');
    const alarmName = message?.update ? `${message.update[0].name}` : null
    return convertAlarmEvent(alarmName)
  };

  return {
    parseAlarmMessage
  }
};
