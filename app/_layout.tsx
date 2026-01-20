import { Stack } from 'expo-router'
import {auth} from '@/services/requests'
import '@/src/i18n'
import { useEffect, useState } from 'react'
import { View } from 'react-native'
import { hydrateAuth, logout, syncUser } from '../store/authStore'
import { initCookies } from '@/services/cookies';


export default function RootLayout() {
  const [ready, setReady] = useState(false)

  async function checkAuth() {
    const res = await auth()
    console.log(res.user.isGuest)

    if (res.user.isGuest) {
      await logout()
    } else {
      await syncUser(res.user)
    }
  }

  useEffect(() => {
    const run = async () => {
      await initCookies()
      await hydrateAuth()
      await checkAuth()
      setReady(true)
    }
    run()
    return () => {
    }
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
