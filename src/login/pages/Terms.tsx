import { ArrowLeft, Check } from 'lucide-react'
import { Button, Checkbox } from '@helpwave/hightide'
import type { KcContext } from '../KcContext'
import { useI18n } from '../i18n'
import Template from 'keycloakify/login/Template'
import { PageLayout } from '../components/PageLayout'
import { useState } from 'react'
import { useTranslation } from '../../i18n/useTranslation'
import type { HelpwaveIdTranslationEntries } from '../../i18n/translations'
import { getPageTitleKey } from '../utils/pageTitles'

type TermsProps = {
    kcContext: Extract<KcContext, { pageId: 'terms.ftl' }>,
};

type PolicyKcContext = Extract<KcContext, { pageId: 'terms.ftl' }>

function isTranslationKey(key: string | undefined): key is keyof HelpwaveIdTranslationEntries {
    return key !== undefined && key.length > 0
}

function PolicyBody({ kcContext }: { kcContext: PolicyKcContext }) {
    const t = useTranslation()
    const labelKey = kcContext.policyAcceptanceLabelKey
    const labelText = isTranslationKey(labelKey) ? t(labelKey) : ''
    return (
        <div
            style={{
                padding: '1rem',
                borderRadius: '0.5rem',
                backgroundColor: 'var(--color-surface)',
            }}
        >
            <p>{labelText}</p>
            {kcContext.policyUrl && (
                <p style={{ marginTop: '0.5rem' }}>
                    <a href={kcContext.policyUrl} target="_blank" rel="noopener noreferrer">
                        {kcContext.policyUrl}
                    </a>
                </p>
            )}
        </div>
    )
}

function PolicyCheckboxLabel({ kcContext }: { kcContext: PolicyKcContext }) {
    const t = useTranslation()
    const labelKey = kcContext.policyAcceptanceLabelKey
    const linkKey = kcContext.policyLinkLabelKey
    const labelText = isTranslationKey(labelKey) ? t(labelKey) : ''
    const linkText = isTranslationKey(linkKey) ? t(linkKey) : kcContext.policyUrl ?? ''
    return (
        <>
            {labelText}{' '}
            {kcContext.policyUrl ? (
                <a
                    href={kcContext.policyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                >
                    {linkText}
                </a>
            ) : (
                linkText
            )}
        </>
    )
}

export default function Terms({ kcContext }: TermsProps) {
    const { i18n } = useI18n({ kcContext })
    const t = useTranslation()
    const [accepted, setAccepted] = useState(false)

    const policyId = kcContext.policyId
    const isPolicyVariant = !!policyId

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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {isPolicyVariant ? (
                        <PolicyBody kcContext={kcContext} />
                    ) : (
                        <div
                            style={{
                                padding: '1rem',
                                borderRadius: '0.5rem',
                                backgroundColor: 'var(--color-surface)',
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
                    )}

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
                                {isPolicyVariant ? (
                                    <PolicyCheckboxLabel kcContext={kcContext} />
                                ) : (
                                    t('acceptTerms')
                                )}
                            </label>
                        </div>

                        {isPolicyVariant && kcContext.policyRequiredError && !accepted && (
                            <div style={{ color: 'var(--color-negative)', fontSize: '0.875rem' }}>
                                {isTranslationKey(kcContext.policyRequiredErrorKey)
                                    ? t(kcContext.policyRequiredErrorKey)
                                    : t('privacyRequired')}
                            </div>
                        )}

                        {isPolicyVariant && (
                            <input type="hidden" name="policy-accepted" value={accepted ? 'true' : 'false'} />
                        )}

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
