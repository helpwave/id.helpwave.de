import type { KcContext } from '../KcContext'
import { useTranslation } from '../../i18n/useTranslation'

type FooterProps = {
    kcContext: KcContext,
}

export function Footer({ kcContext }: FooterProps) {
    const locale = kcContext.locale?.currentLanguageTag ?? 'en'
    const t = useTranslation(locale)

    return (
        <div
            className="text-center text-[13px] mt-8 pt-4 border-t border-[var(--hw-color-neutral-200)] sm:text-xs sm:mt-6 sm:pt-3"
            style={{ color: 'var(--hw-color-neutral-600)' }}
        >
            <div className="mb-2">
                <a
                    href="https://cdn.helpwave.de/imprint.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline mx-2 sm:mx-1"
                    style={{ color: 'var(--hw-color-neutral-600)' }}
                >
                    {t('imprint')}
                </a>
                <span className="mx-2 sm:mx-1">•</span>
                <a
                    href="https://cdn.helpwave.de/privacy.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline mx-2 sm:mx-1"
                    style={{ color: 'var(--hw-color-neutral-600)' }}
                >
                    {t('privacy')}
                </a>
            </div>
        </div>
    )
}