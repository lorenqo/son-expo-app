import { useStore } from '@tanstack/react-store'
import { authStore } from './authStore'

export function useAuth() {
  return useStore(authStore)
}
