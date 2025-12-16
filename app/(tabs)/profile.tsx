import { router, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import LoginPopup from '../../components/LoginPopup'
import { useAuth } from '../../context/AuthContext'

export default function Profile() {
  const { user, logout } = useAuth()
  const { showLogin, autoLogin } = useLocalSearchParams()

  const [loginOpen, setLoginOpen] = useState(false)
  const [autoLoginMode, setAutoLoginMode] = useState(false)

  // 🔔 Реакция на переходы из WebView
  useEffect(() => {
    if (autoLogin === '1') {
      setAutoLoginMode(true)
      setLoginOpen(true)
    } else if (showLogin === '1') {
      setAutoLoginMode(false)
      setLoginOpen(true)
    }
  }, [autoLogin, showLogin])

  // 🧹 Убираем параметры после закрытия попапа
  const closeLogin = () => {
    setLoginOpen(false)
    setAutoLoginMode(false)
    router.setParams({
      showLogin: undefined,
      autoLogin: undefined,
    })
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

          <LoginPopup visible={loginOpen} autoLogin={autoLoginMode} onClose={closeLogin} />
        </View>
      </SafeAreaView>
    )
  }

  // ✅ ЗАЛОГИНЕН
  const avatarUrl = user.pic ? `https://m.liveexpert.org/images/users/${user.pic}.jpg` : null

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.center}>
        {avatarUrl && <Image source={{ uri: `https://c.liveexpert.org/public/images/photo/4602509-mini?nocache=${avatarUrl}` }} style={styles.avatar} />}

        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.balance}>Баланс: {user.balance} ₽</Text>

        {/* 🚪 ВЫХОД */}
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
