import type { HelpwaveIdTranslationEntries, HelpwaveIdTranslationLocales } from './translations'
import { useTranslation as useHightideContextTranslation } from '@helpwave/hightide'

export const useTranslation = () => useHightideContextTranslation<HelpwaveIdTranslationLocales, HelpwaveIdTranslationEntries>()
