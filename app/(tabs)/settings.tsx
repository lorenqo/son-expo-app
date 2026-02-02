import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StyleSheet } from 'react-native-unistyles'

export default function Settings() {
  const { t } = useTranslation()

  return (
      <View style={styles.root}>
        <SafeAreaView style={styles.safe}>
          <View style={styles.container}>
            <Text style={styles.title}>{t('settings.title')}</Text>
            <Text style={styles.subtitle}>{t('settings.inDevelopment')}</Text>
          </View>
        </SafeAreaView>
      </View>
  )
}

const styles = StyleSheet.create(theme => ({
  root: {
    flex: 1,
    minHeight: '100vh' as any,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },

  safe: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',

    paddingHorizontal: theme.gap(3),
    paddingVertical: theme.gap(4),
  },

  title: {
    color: theme.colors.typography,
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.3,
    marginBottom: theme.gap(1.25),
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: theme.colors.dimmed,
    textAlign: 'center',
    maxWidth: 280,
  },
}))
