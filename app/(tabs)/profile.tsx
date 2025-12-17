import { router, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import LoginPopup from '../../components/LoginPopup'
import { useAuth } from '../../context/AuthContext'

export default function Profile() {
  const { user, logout } = useAuth()
  const { login } = useLocalSearchParams()

  const [loginOpen, setLoginOpen] = useState(false)

  // Открытие логина по query-параметру ?login=1
  useEffect(() => {
    if (login === '1') {
      setLoginOpen(true)
    }
  }, [login])

  const closeLogin = () => {
    setLoginOpen(false)
    router.setParams({ login: undefined })
  }

  // ❌ НЕ ЗАЛОГИНЕН
  if (!user) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.title}>Вы не вошли</Text>

          <Pressable style={styles.button} onPress={() => setLoginOpen(true)}>
            <Text style={styles.buttonText}>Войти</Text>
          </Pressable>

          <LoginPopup visible={loginOpen} onClose={closeLogin} />
        </View>
      </SafeAreaView>
    )
  }

  // ✅ ЗАЛОГИНЕН

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.center}>
        <Image source={{ uri: `https://c.liveexpert.org/public/images/photo/${user.id}-mini?nocache=${user.pic}` }} style={styles.avatar} />

        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.balance}>Баланс: {user.balance} ₽</Text>

        <Pressable style={styles.logout} onPress={logout}>
          <Text style={styles.logoutText}>Выйти</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
  },
  balance: {
    fontSize: 16,
    marginTop: 4,
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#2e7d32',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  logout: {
    marginTop: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#e53935',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
  },
})
