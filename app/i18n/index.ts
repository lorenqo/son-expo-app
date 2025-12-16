import { I18n } from 'i18n-js'
import * as Localization from 'expo-localization'
import en from './en'
import ru from './ru'
import uk from './uk'

const i18n = new I18n({ en, ru, uk })

i18n.locale = Localization.getLocales()[0]?.languageTag ?? 'en'
i18n.enableFallback = true

export default i18n
