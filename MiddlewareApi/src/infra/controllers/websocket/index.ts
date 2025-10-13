import { WebSocketServer } from 'ws'
import type { LoggerRepository } from '../../../core/repositories/logger/repository'
import type { WebsocketDataFactoryUsecase } from '../../../core/usecases/websocketDataFactory/usecase'
import { createWebSocketDataObject } from '../../../utils/commonTools'
import { conf as config } from '../../config/index'

interface MyWebSocketServerDeps {
  logger: LoggerRepository
  webSocketDataFactoryUsecase: WebsocketDataFactoryUsecase
}

export interface MyWebSocketServer {
  initWebSocketServer: () => void
}

export const make = (deps: MyWebSocketServerDeps): MyWebSocketServer => {
  const { logger, webSocketDataFactoryUsecase } = deps

  const COMMAND_ID = 3
  const SUBSCRIPTION_ID = 1

  const initWebSocketServer = () => {
    const wss = new WebSocketServer({ port: 8080 })
    wss.on('connection', function connection(ws) {
      var token = global.tbTokens.token
      const entityId = config.thingsBoard.entityId

      if (!entityId) {
        logger.info('Invalid device id!')
        ws.close()
      }
      if (!token) {
        logger.info('Invalid JWT token!')
        ws.close()
      }

      ws.onopen = () => {
        ws.send(JSON.stringify(createWebSocketDataObject(token, entityId)))
        logger.info(`Requested data object has been sent`)
      }

      ws.onclose = () => {
        logger.info('TB WS Connection is closed!')
      }

      ws.onerror = (event) => {
        logger.error(JSON.stringify(event))
      }

      ws.onmessage = (event: any) => {
        const parsedData = JSON.parse(event.data)
        let data: any
        if (parsedData?.subscriptionId === SUBSCRIPTION_ID) {
          data = webSocketDataFactoryUsecase.parseRawDataToTbTelemetries(parsedData.data)
        } else if (parsedData.cmdId === COMMAND_ID) {
          data = webSocketDataFactoryUsecase.managePumpUpdate(parsedData)
        } else {
          data = webSocketDataFactoryUsecase.manageAlarmUpdate(parsedData)
        }
        if (data instanceof Error) {
          logger.error(`Failed to compute raw data, reason: ${data}`)
        } else {
          ws.send(JSON.stringify(data))
        }
      }
    })
  }
  return { initWebSocketServer }
}
