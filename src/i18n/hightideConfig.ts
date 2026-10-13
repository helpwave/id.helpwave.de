import { hightideTranslation } from '@helpwave/hightide'
import { helpwaveIdTranslation, helpwaveIdTranslationLocales } from './translations'

// Keys that hightide has not translated for a locale yet fall back to its English strings
const hightideEnglishFallback = Object.fromEntries(
    helpwaveIdTranslationLocales.map((locale) => [locale, hightideTranslation['en-US']])
)

export const translations = [helpwaveIdTranslation, hightideTranslation, hightideEnglishFallback]
