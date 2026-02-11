import { Button } from '@helpwave/hightide'
import type { KcContext } from '../KcContext'
import { useI18n } from '../i18n'
import Template from 'keycloakify/login/Template'
import { PageLayout } from '../components/PageLayout'
import { AlertBox } from '../components/AlertBox'
import { ArrowLeft, RotateCcw } from 'lucide-react'
import { useTranslation } from '../../i18n/useTranslation'
import { getPageTitleKey } from '../utils/pageTitles'

type ErrorProps = {
    kcContext: Extract<KcContext, { pageId: 'error.ftl' }>,
};

export default function Error({ kcContext }: ErrorProps) {
    const { i18n } = useI18n({ kcContext })
    const t = useTranslation()

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            displayMessage={false}
            headerNode={null}
            doUseDefaultCss={false}
            documentTitle={t(getPageTitleKey(kcContext.pageId))}
        >
            <PageLayout kcContext={kcContext}>
                {kcContext.message && <AlertBox message={kcContext.message} />}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <Button
                        type="button"
                        color="primary"
                        onClick={() => {
                            window.location.href = kcContext.url.loginRestartFlowUrl
                        }}
                    >
                        <RotateCcw className="w-4 h-4" />
                        {t('doRestart') || t('doContinue')}
                    </Button>

                    {kcContext.url.loginUrl && (
                        <Button
                            type="button"
                            color="neutral"
                            coloringStyle="outline"
                            onClick={() => {
                                window.location.href = kcContext.url.loginUrl
                            }}
                        >
                            <ArrowLeft className="w-4 h-4" />
                            {t('backToLogin')}
                        </Button>
                    )}
                </div>
            </PageLayout>
        </Template>
    )
}