import { Button } from '@helpwave/hightide'
import type { KcContext } from '../KcContext'
import { useI18n } from '../i18n'
import Template from 'keycloakify/login/Template'
import { PageLayout } from '../components/PageLayout'
import { ArrowLeft } from 'lucide-react'
import { useTranslation } from '../../i18n/useTranslation'

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
        >
            <PageLayout kcContext={kcContext}>
                {kcContext.message && (
                    <div
                        role="alert"
                        style={{
                            padding: '1rem',
                            borderRadius: '0.5rem',
                            backgroundColor: 'var(--hw-color-negative-50)',
                            color: 'var(--hw-color-negative-900)',
                            marginBottom: '1rem'
                        }}
                    >
                        {kcContext.message.summary}
                    </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <Button
                        type="button"
                        color="primary"
                        onClick={() => {
                            window.location.href = kcContext.url.loginRestartFlowUrl
                        }}
                    >
                        {t('doRestart') || t('doContinue')}
                    </Button>

                    {kcContext.url.loginUrl && (
                        <Button
                            type="button"
                            color="neutral"
                            onClick={() => {
                                window.location.href = kcContext.url.loginUrl
                            }}
                        >
                            <ArrowLeft size={16} style={{ marginRight: '0.5rem', display: 'inline-block' }} />
                            {t('backToLogin')}
                        </Button>
                    )}
                </div>
            </PageLayout>
        </Template>
    )
}