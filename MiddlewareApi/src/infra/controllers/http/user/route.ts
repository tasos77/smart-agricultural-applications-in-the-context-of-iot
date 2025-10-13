import { Hono } from 'hono'
import type { LoggerRepository } from '../../../../core/repositories/logger/repository'
import type { UserManagementUseCase } from '../../../../core/usecases/userManagement/usecase'
import { activateUserBodySchema, createUserBodySchema, fetchUserBodySchema, loginBodySchema, logoutBodySchema } from '../requestSchemas/user'
import { zValidator } from '../requestSchemas/validator-wrapper'

interface UserRouteDeps {
  logger: LoggerRepository
  userManagementUsecase: UserManagementUseCase
  tenantToken: string
}

export const make = (deps: UserRouteDeps): Hono => {
  const { logger, userManagementUsecase, tenantToken } = deps
  const app = new Hono()

  app.post('/login', zValidator('json', loginBodySchema), (c) => {
    const { email, password } = c.req.valid('json')
    const result = userManagementUsecase.login(email, password)
    if (result instanceof Error) {
      c.status(400)
      return c.json({
        msg: result.message,
        status: 400,
        data: {}
      })
    }
    c.status(200)
    return c.json({
      msg: 'Successfull login',
      status: 200,
      data: result.data
    })
  })

  app.post('activate-user', zValidator('json', activateUserBodySchema), (c) => {
    const { activateToken, password } = c.req.valid('json')
    const result = userManagementUsecase.activateUser(tenantToken, activateToken, password)
    if (result instanceof Error) {
      c.status(400)
      return c.json({
        msg: result.message,
        status: 400,
        data: {}
      })
    }
    c.status(200)
    return c.json({
      msg: 'Successfull activation',
      status: 200,
      data: result.data
    })
  })

  app.post('/create-user', zValidator('json', createUserBodySchema), async (c) => {
    const { email, firstName, lastName } = c.req.valid('json')
    const result = await userManagementUsecase.createUser(tenantToken, email, firstName, lastName)
    if (result instanceof Error) {
      c.status(400)
      return c.json({
        msg: result.message,
        status: 400,
        data: {}
      })
    }
    c.status(200)
    return c.json({
      msg: 'Successfull creation',
      status: 200,
      data: {}
    })
  })

  app.post('/logout', zValidator('json', logoutBodySchema), (c) => {
    const { accessToken } = c.req.valid('json')
    const result = userManagementUsecase.logout(accessToken)
    if (result instanceof Error) {
      c.status(400)
      return c.json({
        msg: result.message,
        status: 400,
        data: {}
      })
    }
    c.status(200)
    return c.json({
      msg: 'Successfull logout',
      status: 200,
      data: {}
    })
  })

  app.get('/user', zValidator('json', fetchUserBodySchema), (c) => {
    const { accessToken } = c.req.valid('json')
    const result = userManagementUsecase.fetchUserInfo(accessToken)
    if (result instanceof Error) {
      c.status(400)
      return c.json({
        msg: result.message,
        status: 400,
        data: {}
      })
    }
    c.status(200)
    return c.json({
      msg: 'Successfull fetch',
      status: 200,
      data: result.data
    })
  })

  return app
}
