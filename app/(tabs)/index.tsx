import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '../../store/useAuth'

export default function Index() {
  const { user } = useAuth()
  const { t } = useTranslation()
  const router = useRouter()

  useEffect(() => {
    AsyncStorage.getItem('onboardingCompleted').then((value) => {
      if (value !== 'true') {
        router.replace('/onboarding')
      } else {
        router.replace('/(tabs)')
      }
    })
  }, [])

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>{t('index.title')}</Text>
        <Text style={styles.text}>{user ? `${t('index.loginedUs')} ${user.name}` : t('index.notLogined')}</Text>
        <Pressable onPress={() => AsyncStorage.clear()}>
          <Text>RESET STORAGE</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#1C1022' },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
    color: '#FFFFFF',
  },
  text: {
    fontSize: 16,
    color: '#FFFFFF',
  },
})
