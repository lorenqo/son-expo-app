import { createContext, useContext, useState } from 'react'
import { dictionaries, Lang } from '../app/i18n'

type LangContextType = {
  lang: Lang
  t: typeof dictionaries.ru
  setLang: (l: Lang) => void
}

const LanguageContext = createContext<LangContextType | null>(null)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('ru')

  return (
    <LanguageContext.Provider
      value={{
        lang,
        setLang,
        t: dictionaries[lang],
      }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be inside LanguageProvider')
  return ctx
}
