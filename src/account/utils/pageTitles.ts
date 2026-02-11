import type { KcContext } from '../KcContext'
import type { HelpwaveIdTranslationEntries } from '../../i18n/translations'

const PAGE_TITLE_BY_PAGE_ID: Partial<Record<KcContext['pageId'], keyof HelpwaveIdTranslationEntries>> = {
  'account.ftl': 'pageTitleAccount',
  'password.ftl': 'pageTitleAccountPassword'
}

export function getPageTitleKey(pageId: KcContext['pageId']): keyof HelpwaveIdTranslationEntries {
  return PAGE_TITLE_BY_PAGE_ID[pageId] ?? 'pageTitleAccount'
}

export function getDocumentTitle(
  pageId: KcContext['pageId'],
  t: (key: keyof HelpwaveIdTranslationEntries) => string
): string {
  return `${t(getPageTitleKey(pageId))} | helpwave id`
}
