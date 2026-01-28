import { Button, CheckboxUncontrolled } from '@helpwave/hightide'
import type { KcContext } from '../KcContext'
import { useI18n } from '../i18n'
import Template from 'keycloakify/login/Template'
import { PageLayout } from '../components/PageLayout'
import { useState } from 'react'
import { useTranslation } from '../../i18n/useTranslation'

type TermsProps = {
    kcContext: Extract<KcContext, { pageId: 'terms.ftl' }>,
};

export default function Terms({ kcContext }: TermsProps) {
    const { i18n } = useI18n({ kcContext })
    const locale = kcContext.locale?.currentLanguageTag ?? 'en'
    const t = useTranslation(locale)
    const [accepted, setAccepted] = useState(false)

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            displayMessage={false}
            headerNode={null}
            doUseDefaultCss={false}
        >
            <PageLayout kcContext={kcContext}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div
                        style={{
                            padding: '1rem',
                            borderRadius: '0.5rem',
                            backgroundColor: 'var(--hw-color-neutral-50)',
                            maxHeight: '400px',
                            overflowY: 'auto'
                        }}
                    >
                        {kcContext.__localizationRealmOverridesTermsText ? (
                            <div dangerouslySetInnerHTML={{ __html: kcContext.__localizationRealmOverridesTermsText }} />
                        ) : (
                            <p>{t('termsText')}</p>
                        )}
                    </div>

                    <form action={kcContext.url.loginAction} method="POST" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <CheckboxUncontrolled
                                value={accepted}
                                onValueChange={(value) => setAccepted(value)}
                                onEditComplete={() => {}}
                                size="md"
                            />
                            <label>{t('acceptTerms')}</label>
                        </div>

                        <Button type="submit" color="primary" disabled={!accepted}>
                            {t('doAccept')}
                        </Button>
                        <Button
                            type="button"
                            color="secondary"
                            onClick={() => {
                                window.location.href = kcContext.url.loginUrl
                            }}
                        >
                            {t('doDecline')}
                        </Button>
                    </form>
                </div>
            </PageLayout>
        </Template>
    )
}