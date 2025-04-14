"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { type Language, translations } from "./translations"

type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Get initial language from localStorage or default to English
  const [language, setLanguageState] = useState<Language>("en")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && ["en", "ja", "vi"].includes(savedLanguage)) {
      setLanguageState(savedLanguage)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("language", lang)
  }

  // Translation function
  const t = (key: string) => {
    const keys = key.split(".")
    let value: any = translations[language]

    for (const k of keys) {
      if (value && value[k]) {
        value = value[k]
      } else {
        // Fallback to English if translation is missing
        let fallback: any = translations["en"]
        for (const fk of keys) {
          if (fallback && fallback[fk]) {
            fallback = fallback[fk]
          } else {
            return key // Return the key if translation is missing in both languages
          }
        }
        return fallback
      }
    }

    return value
  }

  // Don't render anything on the server
  if (!mounted) {
    return <>{children}</>
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

// Update the useLanguage hook to handle the case when it's called outside a provider
export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    // Return a default context with English translations when used outside provider
    // This helps during server-side rendering
    return {
      language: "en" as Language,
      setLanguage: () => {},
      t: (key: string) => {
        const keys = key.split(".")
        let value: any = translations["en"]

        for (const k of keys) {
          if (value && value[k]) {
            value = value[k]
          } else {
            return key
          }
        }

        return value
      },
    }
  }
  return context
}
