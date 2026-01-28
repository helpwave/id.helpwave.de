import { combineTranslation } from '@helpwave/internationalization'
import { helpwaveIdTranslation, type HelpwaveIdTranslationLocales } from './translations'

export function useTranslation(locale?: string) {
    const lang = (locale ?? 'en') as HelpwaveIdTranslationLocales
    return combineTranslation(helpwaveIdTranslation, lang)
}