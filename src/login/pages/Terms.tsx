import { ArrowLeft, Check } from 'lucide-react'
import { Button, Checkbox } from '@helpwave/hightide'
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
    const t = useTranslation()
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
                            <Checkbox
                                value={accepted}
                                onValueChange={(value: boolean) => setAccepted(value)}
                                onEditComplete={() => {}}
                                size="md"
                            />
                            <label
                                onClick={() => setAccepted(!accepted)}
                                onKeyDown={(e) => e.key === 'Enter' && setAccepted((prev) => !prev)}
                                style={{ cursor: 'pointer', userSelect: 'none' }}
                                role="button"
                                tabIndex={0}
                            >
                                {t('acceptTerms')}
                            </label>
                        </div>

                        <Button type="submit" color="primary" disabled={!accepted}>
                            <Check className="w-4 h-4" />
                            {t('doAccept')}
                        </Button>
                        <Button
                            type="button"
                            color="neutral"
                            coloringStyle="outline"
                            onClick={() => {
                                window.location.href = kcContext.url.loginUrl
                            }}
                        >
                            <ArrowLeft className="w-4 h-4" />
                            {t('doDecline')}
                        </Button>
                    </form>
                </div>
            </PageLayout>
        </Template>
    )
}