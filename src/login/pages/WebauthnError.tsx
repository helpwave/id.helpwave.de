import { Button } from '@helpwave/hightide'
import type { KcContext } from '../KcContext'
import { useI18n } from '../i18n'
import Template from 'keycloakify/login/Template'
import { PageLayout } from '../components/PageLayout'
import { useTranslation } from '../../i18n/useTranslation'

type WebauthnErrorProps = {
    kcContext: Extract<KcContext, { pageId: 'webauthn-error.ftl' }>,
};

export default function WebauthnError({ kcContext }: WebauthnErrorProps) {
    const { i18n } = useI18n({ kcContext })
    const locale = kcContext.locale?.currentLanguageTag ?? 'en'
    const t = useTranslation(locale)

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
                            backgroundColor: 'var(--hw-color-negative-50)',
                            color: 'var(--hw-color-negative-900)',
                            marginBottom: '1rem'
                        }}
                    >
                        {kcContext.message.summary}
                    </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <p>{t('webauthnErrorMessage')}</p>

                    <Button
                        type="button"
                        color="primary"
                        onClick={() => {
                            window.location.href = kcContext.url.loginRestartFlowUrl
                        }}
                    >
                        {t('doRestart')}
                    </Button>
                </div>
            </PageLayout>
        </Template>
    )
}
