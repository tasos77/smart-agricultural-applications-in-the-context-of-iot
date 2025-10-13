import type { ForecastApiRepository } from './core/repositories/forecastApi/repository'
import type { ThingsboardRepository } from './core/repositories/thingsboardApi/repository'
import type { AlarmManagerService } from './core/services/alarmManager/service'
import * as amService from './core/services/alarmManager/service'
import type { DataManagerService } from './core/services/dataManager/service'
import * as dmService from './core/services/dataManager/service'
import type { PumpStateManagerService } from './core/services/pumpStateManager/service'
import * as psService from './core/services/pumpStateManager/service'
import type { UserManagementService } from './core/services/userManager/service'
import * as umService from './core/services/userManager/service'
import type { WsTelemetryDataConverterService } from './core/services/wsTelemetryDataConverter/service'
import * as wsService from './core/services/wsTelemetryDataConverter/service'
import type { DataManagementUsecase } from './core/usecases/dataManagement/usecase'
import * as dmUsecase from './core/usecases/dataManagement/usecase'
import type { UserManagementUseCase } from './core/usecases/userManagement/usecase'
import * as umUsecase from './core/usecases/userManagement/usecase'
import type { WebsocketDataFactoryUsecase } from './core/usecases/websocketDataFactory/usecase'
import * as wsUsecase from './core/usecases/websocketDataFactory/usecase'
import { conf as config } from './infra/config/index'
import * as ckRoute from './infra/controllers/http/check/route'
import server from './infra/controllers/http/server'
import * as usrRoute from './infra/controllers/http/user/route'
import * as wtRoute from './infra/controllers/http/watering/route'
import * as ws from './infra/controllers/websocket/index'
import * as frRepo from './infra/repositories/forecastApi/repository'
import * as tbRepo from './infra/repositories/thingsboardApi/repository'
import { logger } from './utils/logger'

// init repositories
const thingsboardRepo: ThingsboardRepository = tbRepo.make({ config, logger })
const forecastRepo: ForecastApiRepository = frRepo.make({ config, logger })

// init services
const alarmManagerService: AlarmManagerService = amService.make({ logger })
const dataManagerService: DataManagerService = dmService.make({ config, logger, forecastRepo, thingsboardRepo })
const pumpStateManagerService: PumpStateManagerService = psService.make({ logger })
const userManagerService: UserManagementService = umService.make({ logger, thingsboardRepo })
const wsTelemetryDataConverterService: WsTelemetryDataConverterService = wsService.make({ logger })

// fetch tenant token
// const tenantToken = await thingsboardRepo.login(config.thingsBoard.tenantUsername, config.thingsBoard.tenantPassword)
const tenantToken = 'asdasd'
// init usecases
const dataManagementUsecase: DataManagementUsecase = dmUsecase.make({ logger, dataManagerService, tenantToken })
const userManagementUsecase: UserManagementUseCase = umUsecase.make({ userManagerService })
const webSocketDataFactoryUsecase: WebsocketDataFactoryUsecase = wsUsecase.make({ logger, alarmManagerService, pumpStateManagerService, wsTelemetryDataConverterService })

// init routes & sockets
const checkRoute = ckRoute.make()
const userRoute = usrRoute.make({ logger, userManagementUsecase, tenantToken })
const watering = wtRoute.make({ config, tenantToken, thingsboardRepo })
const weatherRoute = wtRoute.make({ dataManagementUsecase })
const webSocket = ws.make({ logger, webSocketDataFactoryUsecase })

// init processes
dataManagementUsecase.wateringPolling(tenantToken)
webSocket.initWebSocketServer()

//include routes
const basePath = '/api/v1'
server.route(basePath, checkRoute)
server.route(basePath, userRoute)
server.route(basePath, weatherRoute)
server.route(basePath, watering)

/// start server ///
export default {
  port: config.server.port,
  fetch: server.fetch,
  idleTimeout: 180
}
