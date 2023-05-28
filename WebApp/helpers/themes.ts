import { ThemeDefinition } from 'vuetify'

// String that represents the name of the dark theme I am using
export const MAIN_THEME = 'mainTheme'
// Dark mode theme
export const mainTheme: ThemeDefinition = {
  dark: true,
  colors: {
    // CSS DARK THEME PRIMARY COLORS
    color_primary_100: '#0095ff',
    color_primary_200: '#4aa0ff',
    color_primary_300: '#6babff',
    color_primary_400: '#85b7ff',
    color_primary_500: '#9cc2ff',
    color_primary_600: '#b2ceff',

    // CSS DARK THEME SURFACE COORS
    color_surface_100: '#121212',
    color_surface_200: '#282828',
    color_surface_300: '#3f3f3f',
    color_surface_400: '#575757',
    color_surface_500: '#717171',
    color_surface_600: '#8b8b8b',

    // CSS DARK THEME MIXED SURFACE COLORS

    color_surface_mixed_100: '#191e26',
    color_surface_mixed_200: '#2e333a',
    color_surface_mixed_300: '#454950',
    color_surface_mixed_400: '#5d6067',
    color_surface_mixed_500: '#76797e',
    color_surface_mixed_600: '#909297'
  }
}
