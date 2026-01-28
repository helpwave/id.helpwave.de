import { combineTranslation } from '@helpwave/internationalization'
import { helpwaveIdTranslation, type HelpwaveIdTranslationLocales } from './translations'

export function useTranslation(locale?: string) {
    const lang = (locale ?? 'en') as HelpwaveIdTranslationLocales
    console.log(locale, lang)
    return combineTranslation(helpwaveIdTranslation, lang)
}
