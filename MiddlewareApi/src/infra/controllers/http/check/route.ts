import { Hono } from "hono";

export const make = () => {
  const app = new Hono()
  app.get('/alive', (c) => c.text('Alive'))
  app.get('/ready', (c) => c.text('Ready'))
  return app
}
