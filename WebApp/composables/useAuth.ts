import { useTokensAuthStore } from '../stores/auth'

const auth = useTokensAuthStore()

const getTokenState = () => {
  const token = auth.getLocalToken()
  return token ? true : false
}

export { getTokenState }
