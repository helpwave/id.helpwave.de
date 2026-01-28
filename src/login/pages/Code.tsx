import { useState } from 'react'
import { Button, Input, FormFieldLayout } from '@helpwave/hightide'
import type { KcContext } from '../KcContext'
import { useI18n } from '../i18n'
import Template from 'keycloakify/login/Template'
import { PageLayout } from '../components/PageLayout'
import { useTranslation } from '../../i18n/useTranslation'
import { useTranslatedFieldError } from '../utils/translateFieldError'

type CodeProps = {
    kcContext: Extract<KcContext, { pageId: 'code.ftl' }>,
};

export default function Code({ kcContext }: CodeProps) {
    const { i18n } = useI18n({ kcContext })
    const t = useTranslation()
    const translateError = useTranslatedFieldError()
    const [code, setCode] = useState('')

    const codeError = kcContext.messagesPerField?.existsError('code')
        ? kcContext.messagesPerField.get('code')
        : undefined

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
                            backgroundColor:
                                kcContext.message.type === 'error'
                                    ? 'var(--hw-color-negative-50)'
                                    : 'var(--hw-color-positive-50)',
                            color:
                                kcContext.message.type === 'error'
                                    ? 'var(--hw-color-negative-900)'
                                    : 'var(--hw-color-positive-900)',
                            marginBottom: '1rem'
                        }}
                    >
                        {kcContext.message.summary}
                    </div>
                )}

                <form
                    action={kcContext.url.loginAction}
                    method="post"
                    style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                >
                    <div className="mb-4">
                        <FormFieldLayout
                            label={t('loginOtp') || t('otp')}
                            invalidDescription={translateError(codeError)}
                            required
                        >
                            {({ id, ariaAttributes }) => (
                                <Input
                                    id={id}
                                    name="code"
                                    type="text"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    autoFocus
                                    autoComplete="one-time-code"
                                    required
                                    {...ariaAttributes}
                                />
                            )}
                        </FormFieldLayout>
                    </div>

                    <Button type="submit" color="primary">
                        {t('doSubmit')}
                    </Button>
                </form>
            </PageLayout>
        </Template>
    )
}