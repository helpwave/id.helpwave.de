import { Button } from '@helpwave/hightide'
import type { KcContext } from '../KcContext'
import { useI18n } from '../i18n'
import Template from 'keycloakify/login/Template'
import { PageLayout } from '../components/PageLayout'
import { ArrowLeft } from 'lucide-react'
import { useTranslation } from '../../i18n/useTranslation'

type InfoProps = {
    kcContext: Extract<KcContext, { pageId: 'info.ftl' }>,
};

export default function Info({ kcContext }: InfoProps) {
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
                            backgroundColor:
                                kcContext.message.type === 'error'
                                    ? 'var(--hw-color-negative-50)'
                                    : kcContext.message.type === 'warning'
                                      ? 'var(--hw-color-warning-50)'
                                      : 'var(--hw-color-positive-50)',
                            color:
                                kcContext.message.type === 'error'
                                    ? 'var(--hw-color-negative-900)'
                                    : kcContext.message.type === 'warning'
                                      ? 'var(--hw-color-warning-900)'
                                      : 'var(--hw-color-positive-900)',
                            marginBottom: '1rem'
                        }}
                    >
                        {kcContext.message.summary}
                    </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {kcContext.messageHeader && (
                        <h2>{kcContext.messageHeader}</h2>
                    )}

                    <Button
                        type="button"
                        color="neutral"
                        coloringStyle="outline"
                        onClick={() => {
                            window.location.href = kcContext.url.loginUrl
                        }}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        {t('backToApplication') || t('doContinue')}
                    </Button>
                </div>
            </PageLayout>
        </Template>
    )
}