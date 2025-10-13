import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { prettyJSON } from 'hono/pretty-json'
import { secureHeaders } from 'hono/secure-headers'

const app = new Hono()
app.use('*', cors({ origin: '*' }))
app.use('*', prettyJSON())
app.use(secureHeaders())
app.options('*', (c) => c.body(null, 204))

export default app
