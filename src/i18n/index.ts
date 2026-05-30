import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Localization from 'expo-localization'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { I18nManager } from 'react-native'
import translationEn from './locales/en-US/translations.json'
import translationRu from './locales/ru-RU/translations.json'
import translationUa from './locales/ua-UA/translations.json'

const resources = {
  'en-US': { translation: translationEn },
  en: { translation: translationEn },
  'ru-RU': { translation: translationRu },
  ru: { translation: translationRu },
  'ua-UA': { translation: translationUa },
  ua: { translation: translationUa },
}

const RTL_LANGUAGES: string[] = []

const LANGUAGE_KEY = '@app_language'

const isServer = typeof window === 'undefined'

const initI18n = async () => {
  try {
    // Try to get saved language preference
    const savedLanguage = isServer ? null : await AsyncStorage.getItem(LANGUAGE_KEY)

    // Determine which language to use
    let selectedLanguage = savedLanguage

    if (!selectedLanguage) {
      // If no saved language, use device locale or fallback
      const deviceLocales = Localization.getLocales()
      const deviceLocale = deviceLocales[0]?.languageTag || 'en-US'
      const languageCode = deviceLocale.split('-')[0]

      // Try exact locale match first
      if (deviceLocale in resources) {
        selectedLanguage = deviceLocale
      }

      // Then try language code match
      else if (languageCode in resources) {
        selectedLanguage = languageCode
      } else {
        selectedLanguage = 'en-US'
      }
    }

    // Handle RTL layout
    const isRTL = RTL_LANGUAGES.includes(selectedLanguage)

    if (I18nManager.isRTL !== isRTL) {
      I18nManager.allowRTL(isRTL)
      I18nManager.forceRTL(isRTL)
    }

    await i18n.use(initReactI18next).init({
      resources,
      lng: selectedLanguage,
      fallbackLng: {
        'en-*': ['en-US', 'en'],
        'ru-*': ['ru-RU', 'ru', 'en-US'],
        'ua-*': ['ua-UA', 'ua', 'en-US'],
        default: ['en-US'],
      },
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    })

    // Save the selected language
    if (!savedLanguage && !isServer) {
      await AsyncStorage.setItem(LANGUAGE_KEY, selectedLanguage)
    }
  } catch (error) {
    console.error('Error initializing i18n:', error)

    // Initialize with defaults if there's an error
    await i18n.use(initReactI18next).init({
      resources,
      lng: 'en-US',
      fallbackLng: 'en-US',
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    })
  }
}

initI18n()

export default i18n
