import { useTranslation } from '../../i18n/useTranslation'

export function Footer() {
    const t = useTranslation()

    return (
        <div className="text-center text-sm pt-4">
            <div className="mb-2">
                <a
                    href="https://helpwave.de/imprint"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mx-2 sm:mx-1"
                >
                    {t('imprint')}
                </a>
                <span className="mx-2 sm:mx-1">•</span>
                <a
                    href="https://helpwave.de/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mx-2 sm:mx-1"
                >
                    {t('privacy')}
                </a>
            </div>
        </div>
    )
}
