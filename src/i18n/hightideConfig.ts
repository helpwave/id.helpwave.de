import type { ComponentProps } from 'react'
import type { HightideProvider, SupportedLocalesConfig } from '@helpwave/hightide'
import { HightideConfigUtils, hightideTranslation } from '@helpwave/hightide'
import { helpwaveIdTranslation, helpwaveIdTranslationLocales } from './translations'

// Metadata for locales that hightide does not ship as defaults yet (mirrors upstream hightide).
const additionalLocales: SupportedLocalesConfig = {
    'pt-BR': { localName: 'Português (Brasil)', defaultIs24HourFormat: true, defaultStartingWeekday: 'sunday', defaultCalendarType: 'Gregorian' },
    'es-ES': { localName: 'Español', defaultIs24HourFormat: true, defaultStartingWeekday: 'monday', defaultCalendarType: 'Gregorian' },
    'fr-FR': { localName: 'Français', defaultIs24HourFormat: true, defaultStartingWeekday: 'monday', defaultCalendarType: 'Gregorian' },
    'nl-NL': { localName: 'Nederlands', defaultIs24HourFormat: true, defaultStartingWeekday: 'monday', defaultCalendarType: 'Gregorian' },
    'it-IT': { localName: 'Italiano', defaultIs24HourFormat: true, defaultStartingWeekday: 'monday', defaultCalendarType: 'Gregorian' },
    'pl-PL': { localName: 'Polski', defaultIs24HourFormat: true, defaultStartingWeekday: 'monday', defaultCalendarType: 'Gregorian' },
    'tr-TR': { localName: 'Türkçe', defaultIs24HourFormat: true, defaultStartingWeekday: 'monday', defaultCalendarType: 'Gregorian' },
    'ro-RO': { localName: 'Română', defaultIs24HourFormat: true, defaultStartingWeekday: 'monday', defaultCalendarType: 'Gregorian' },
    'el-GR': { localName: 'Ελληνικά', defaultIs24HourFormat: false, defaultStartingWeekday: 'monday', defaultCalendarType: 'Gregorian' },
    'ru-RU': { localName: 'Русский', defaultIs24HourFormat: true, defaultStartingWeekday: 'monday', defaultCalendarType: 'Gregorian' },
}

const hightideLocales: Record<string, unknown> = hightideTranslation

export const supportedLocales: SupportedLocalesConfig = Object.fromEntries(
    helpwaveIdTranslationLocales.map((locale) => [
        locale,
        { ...additionalLocales[locale], ...(HightideConfigUtils.defaultSupportedLocales as SupportedLocalesConfig)[locale] },
    ])
)

// hightide's own component strings fall back to English for locales it does not translate yet
const hightideFallbackTranslation = Object.fromEntries(
    helpwaveIdTranslationLocales
        .filter((locale) => !hightideLocales[locale])
        .map((locale) => [locale, hightideTranslation['en-US']])
)

export const hightideProviderProps: Omit<ComponentProps<typeof HightideProvider>, 'children'> = {
    locale: { supportedLocales },
    translation: { translation: [helpwaveIdTranslation, hightideFallbackTranslation] },
}
