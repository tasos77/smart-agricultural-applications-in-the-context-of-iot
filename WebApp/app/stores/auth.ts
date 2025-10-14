import { defineStore } from 'pinia'

interface Tokens {
  token: string | null
  refreshToken: string | null
}

const createAccessToken = (token: string): string => {
  return `Bearer ${token}`
}

export const useTokensAuthStore = defineStore('tokens', {
  state: (): Tokens => ({
    token: null,
    refreshToken: null
  }),
  getters: {
    getTokens: (state: Tokens) => state
  },
  actions: {
    setLocalTokens(tokens: Tokens) {
      localStorage.setItem(`_auth_.token`, createAccessToken(tokens.token))
      localStorage.setItem(`_auth_.refreshToken`, tokens.refreshToken)
    },
    getLocalToken() {
      return localStorage.getItem('_auth_.token')
    },
    getLocalRefreshToken() {
      return localStorage.getItem('_auth_.refreshToken')
    },
    removeTokens() {
      localStorage.removeItem('_auth_.token')
      localStorage.removeItem('_auth_.refreshToken')
    }
  }
})
