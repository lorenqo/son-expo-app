import '@/src/i18n'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import LoginPopup from '../../components/LoginPopup'
import { logout } from '../../store/authStore'
import { useAuth } from '../../store/useAuth'

export default function Profile() {
  const { user, hydrated } = useAuth()
  const [loginOpen, setLoginOpen] = useState(false)
  const { t, i18n } = useTranslation()
  const apiUrl = process.env.EXPO_PUBLIC_API_URL

  const handleLanguageChange = async (language: string) => {
    try {
      const LANGUAGE_KEY = '@app_language'
      await i18n.changeLanguage(language)
      await AsyncStorage.setItem(LANGUAGE_KEY, language)
      console.log('language saved', language)
    } catch (error) {
      console.error('Error changing language:', error)
    }
  }

  if (!hydrated) return null

  if (!user) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.title}>{t('profile.notLoggedIn')}</Text>

          <Pressable style={styles.button} onPress={() => setLoginOpen(true)}>
            <Text style={styles.buttonText}>{t('auth.loginButton')}</Text>
          </Pressable>

          <LoginPopup visible={loginOpen} onClose={() => setLoginOpen(false)} />
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.center}>
        <Image source={{ uri: `${apiUrl}/public/images/photo/${user.id}-mini?nocache=${user.pic}` }} style={styles.avatar} />

        <Text style={styles.name}>{user.name}</Text>

        <Text style={styles.balance}>
          {t('profile.balance')}: {user.balance} ₽
        </Text>
        <View style={styles.language}>
          <Pressable style={({ pressed }) => [styles.flagButton, pressed && styles.buttonPressed]} onPress={() => handleLanguageChange('en-US')}>
            <Text style={styles.flagText}>🇺🇸</Text>
          </Pressable>

          <Pressable style={({ pressed }) => [styles.flagButton, pressed && styles.buttonPressed]} onPress={() => handleLanguageChange('ru-RU')}>
            <Text style={styles.flagText}>🇷🇺</Text>
          </Pressable>

          <Pressable style={({ pressed }) => [styles.flagButton, pressed && styles.buttonPressed]} onPress={() => handleLanguageChange('ua-UA')}>
            <Text style={styles.flagText}>🇺🇦</Text>
          </Pressable>
        </View>
        <Pressable style={styles.logout} onPress={logout}>
          <Text style={styles.logoutText}>{t('profile.logout')}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
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
  language: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flagButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
    margin: 10,
  },
  buttonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  flagText: {
    fontSize: 24,
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
