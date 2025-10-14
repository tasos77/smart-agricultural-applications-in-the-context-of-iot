import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import { MAIN_THEME, mainTheme } from '../helpers/themes'

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    components,
    directives,
    // add theme
    theme: {
      defaultTheme: MAIN_THEME,
      themes: {
        mainTheme
      }
    }
  })

  app.vueApp.use(vuetify)
})
