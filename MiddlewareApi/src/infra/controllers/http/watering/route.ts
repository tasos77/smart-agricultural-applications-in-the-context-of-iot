import { Hono } from 'hono'
import moment from 'moment'
import type { Config } from '../../../../config/schema'
import type { ThingsboardRepository } from '../../../../core/repositories/thingsboardApi/repository'

interface WateringRouteDeps {
  config: Config
  tenantToken: string
  thingsboardRepo: ThingsboardRepository
}

export const make = (deps: WateringRouteDeps): Hono => {
  const { config, tenantToken, thingsboardRepo } = deps
  const app = new Hono()

  app.post(`/watering-now`, async (c) => {
    const now = moment().valueOf()
    const result = await thingsboardRepo.updateDeviceSharedAttribute(tenantToken, config.thingsBoard.deviceId as string, now)
    if (result instanceof Error) {
      c.status(500)
      return c.json({ msg: 'Failed to update watering status', status: 400, data: {} })
    }
    c.status(200)
    return c.json({ msg: 'Watering status updated', status: 200, data: {} })
  })

  return app
}
