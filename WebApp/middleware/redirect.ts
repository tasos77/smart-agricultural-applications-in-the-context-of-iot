import { useTokensAuthStore} from '~/stores/auth'

const tokensAuthStore = useTokensAuthStore()

export default defineNuxtRouteMiddleware((to, from) => {
  const app = useNuxtApp()
  const token = tokensAuthStore.getLocalToken() ? true : false
  if (token) {
    return navigateTo('/dashboard')
  }
  return true
})
