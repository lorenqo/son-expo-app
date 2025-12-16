import { router } from 'expo-router'
import { Pressable, StyleSheet, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { WebView } from 'react-native-webview'

export default function RegisterScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <WebView
        source={{ uri: 'https://www.liveexpert.org/login/register' }}
        incognito
        onNavigationStateChange={(nav) => {
          if (nav.url.includes('/profile/welcome')) {
            router.replace({
              pathname: '/profile',
              params: {
                autoLogin: '1',
              },
            })
          }

          // АККАУНТ УЖЕ СУЩЕСТВУЕТ
          if (nav.url.endsWith('/login')) {
            router.replace({
              pathname: '/profile',
              params: {
                showLogin: '1',
              },
            })
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
