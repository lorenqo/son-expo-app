import { router } from 'expo-router'
import { useRef } from 'react'
import { Pressable, StyleSheet, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { WebView } from 'react-native-webview'

export default function RegisterScreen() {
  const handledRef = useRef(false)

  return (
    <SafeAreaView style={styles.safe}>
      <WebView
        source={{ uri: 'https://www.liveexpert.org/login/register' }}
        incognito
        onNavigationStateChange={(nav) => {
          if (handledRef.current) return

          const url = nav.url

          // ✔ регистрация завершена
          if (url.includes('/profile/welcome')) {
            handledRef.current = true
            router.replace('/profile?login=1')
          }

          // ✔ аккаунт уже существует
          if (url.endsWith('/login')) {
            handledRef.current = true
            router.replace('/profile?login=1')
          }
        }}
      />

      <Pressable style={styles.close} onPress={() => router.back()}>
        <Text style={styles.closeText}>Закрыть</Text>
      </Pressable>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  close: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  closeText: {
    color: '#fff',
    fontSize: 14,
  },
})
