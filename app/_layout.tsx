import '@/src/i18n'
import { Stack } from 'expo-router'
import { useEffect, useState } from 'react'
import { hydrateAuth } from '../store/authStore'

export default function RootLayout() {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    hydrateAuth().finally(() => setReady(true))
  }, [])

  if (!ready) return null // или splash

  return <Stack screenOptions={{ headerShown: false }} />
}
