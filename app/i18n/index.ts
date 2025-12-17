import en from './en'
import ru from './ru'
import uk from './uk'

export const dictionaries = { ru, en, uk }
export type Lang = keyof typeof dictionaries
