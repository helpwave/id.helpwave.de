import { RotateCcw } from 'lucide-react'
import { Button } from '@helpwave/hightide'
import type { KcContext } from '../KcContext'
import { useI18n } from '../i18n'
import Template from 'keycloakify/login/Template'
import { PageLayout } from '../components/PageLayout'
import { AlertBox } from '../components/AlertBox'
import { useTranslation } from '../../i18n/useTranslation'
import { getPageTitleKey } from '../utils/pageTitles'

type WebauthnErrorProps = {
    kcContext: Extract<KcContext, { pageId: 'webauthn-error.ftl' }>,
};

export default function WebauthnError({ kcContext }: WebauthnErrorProps) {
    const { i18n } = useI18n({ kcContext })
    const t = useTranslation()

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            displayMessage={!!kcContext.message}
            headerNode={null}
            doUseDefaultCss={false}
            documentTitle={t(getPageTitleKey(kcContext.pageId))}
        >
            <PageLayout kcContext={kcContext}>
                {kcContext.message && <AlertBox message={kcContext.message} />}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <p>{t('webauthnErrorMessage')}</p>

                    <Button
                        type="button"
                        color="primary"
                        onClick={() => {
                            window.location.href = kcContext.url.loginRestartFlowUrl
                        }}
                    >
                        <RotateCcw className="w-4 h-4" />
                        {t('doRestart')}
                    </Button>
                </div>
            </PageLayout>
        </Template>
    )
}
