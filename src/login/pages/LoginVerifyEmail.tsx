import { ArrowRight } from 'lucide-react'
import { Button } from '@helpwave/hightide'
import type { KcContext } from '../KcContext'
import { useI18n } from '../i18n'
import Template from 'keycloakify/login/Template'
import { PageLayout } from '../components/PageLayout'
import { useTranslation } from '../../i18n/useTranslation'

type LoginVerifyEmailProps = {
    kcContext: Extract<KcContext, { pageId: 'login-verify-email.ftl' }>,
};

export default function LoginVerifyEmail({ kcContext }: LoginVerifyEmailProps) {
    const { i18n } = useI18n({ kcContext })
    const t = useTranslation()

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            displayMessage={!!kcContext.message}
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
                            backgroundColor: 'var(--hw-color-positive-50)',
                            color: 'var(--hw-color-positive-900)',
                            marginBottom: '1rem'
                        }}
                    >
                        {kcContext.message.summary}
                    </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <p>{t('emailVerificationBody1') || t('emailVerificationBody')}</p>
                    <Button
                        type="button"
                        color="primary"
                        onClick={() => {
                            window.location.href = kcContext.url.loginRestartFlowUrl
                        }}
                    >
                        <ArrowRight className="w-4 h-4" />
                        {t('doClickHere') || t('doContinue')}
                    </Button>
                </div>
            </PageLayout>
        </Template>
    )
}