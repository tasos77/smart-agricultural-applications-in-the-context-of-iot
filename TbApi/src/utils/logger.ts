import { ConsoleTransport, LogLayer } from 'loglayer'
import { DateTime } from 'luxon'
import pkg from '../../package.json'

export const logger = new LogLayer({
  transport: new ConsoleTransport({
    logger: console
  }),
  // Optional configurations
  prefix: `[${pkg.description}]`,
  // Plugins
  plugins: [
    {
      id: 'timestamp-plugin',
      onBeforeDataOut: ({ data }) => {
        if (data) {
          data.timestamp = DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss')
        }
        return data
      }
    }
  ]
})
