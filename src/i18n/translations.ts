// AUTO-GENERATED. DO NOT EDIT.
/* eslint-disable @stylistic/quote-props */
/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Translation } from '@helpwave/internationalization'
import { TranslationGen } from '@helpwave/internationalization'

export const helpwaveIdTranslationLocales = ['de', 'en'] as const

export type HelpwaveIdTranslationLocales = typeof helpwaveIdTranslationLocales[number]

export type HelpwaveIdTranslationEntries = {
  'helpwaveId': string,
  'nOrganization': (values: { count: number }) => string,
}

export const helpwaveIdTranslation: Translation<HelpwaveIdTranslationLocales, Partial<HelpwaveIdTranslationEntries>> = {
  'de': {
    'helpwaveId': `helpwave id`,
    'nOrganization': ({ count }): string => {
      return TranslationGen.resolvePlural(count, {
        '=1': `${count} Organisation`,
        'other': `${count} Organisationen`,
      })
    }
  },
  'en': {
    'helpwaveId': `helpwave id`,
    'nOrganization': ({ count }): string => {
      return TranslationGen.resolvePlural(count, {
        '=1': `${count} Organization`,
        'other': `${count} Organizations`,
      })
    }
  }
}

