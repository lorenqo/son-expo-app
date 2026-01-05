import { auth } from '@/services/auth'
import '@/src/i18n'
import { Stack } from 'expo-router'
import { useEffect, useState } from 'react'
import { View } from 'react-native'
import { hydrateAuth, logout, syncUser } from '../store/authStore'

export default function RootLayout() {
  const [ready, setReady] = useState(false)
  async function checkAuth() {
    const res = await auth()
    console.log(res.user.isGuest)
    if (res.user.isGuest) {
      await logout()
      return
    } else {
      await syncUser(res.user)
    }
  }
  useEffect(() => {
    const run = async () => {
      await hydrateAuth()
      await checkAuth()
      setReady(true)
    }

    run()
  }, [])

  if (!ready) return null

  return (
    <View style={{ flex: 1, backgroundColor: '#1C0F21' }}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: '#1C0F21',
          },
        }}
      />
    </View>
  )
}
