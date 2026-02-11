import { useTranslation } from '../../i18n/useTranslation'

export function Footer() {
    const t = useTranslation()

    return (
        <div
            className="text-center text-sm pt-4"
        >
            <div className="mb-2">
                <a
                    href="https://cdn.helpwave.de/imprint.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mx-2 sm:mx-1"
                    style={{ color: 'var(--hw-color-neutral-600)' }}
                >
                    {t('imprint')}
                </a>
                <span className="mx-2 sm:mx-1">•</span>
                <a
                    href="https://cdn.helpwave.de/privacy.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mx-2 sm:mx-1"
                    style={{ color: 'var(--hw-color-neutral-600)' }}
                >
                    {t('privacy')}
                </a>
            </div>
        </div>
    )
}
