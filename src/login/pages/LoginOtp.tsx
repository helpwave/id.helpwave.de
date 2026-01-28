import { useState } from 'react'
import { Button, Input, FormFieldLayout, SelectUncontrolled, SelectOption } from '@helpwave/hightide'
import type { KcContext } from '../KcContext'
import { useI18n } from '../i18n'
import Template from 'keycloakify/login/Template'
import { PageLayout } from '../components/PageLayout'
import { useTranslation } from '../../i18n/useTranslation'
import { useTranslatedFieldError } from '../utils/translateFieldError'

type LoginOtpProps = {
    kcContext: Extract<KcContext, { pageId: 'login-otp.ftl' }>,
};

export default function LoginOtp({ kcContext }: LoginOtpProps) {
    const { i18n } = useI18n({ kcContext })
    const t = useTranslation()
    const translateError = useTranslatedFieldError()

    const [otp, setOtp] = useState('')

    const otpError = kcContext.messagesPerField?.existsError('otp')
        ? kcContext.messagesPerField.get('otp')
        : undefined

    const message = kcContext.message

    const otpLogin = kcContext.otpLogin
    const credentials = otpLogin?.userOtpCredentials ?? []
    const hasMultipleSources = credentials.length > 1

    const [selectedCredentialId, setSelectedCredentialId] = useState(credentials[0]?.id ?? '')

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            displayMessage={!!message}
            headerNode={null}
            doUseDefaultCss={false}
        >
            <PageLayout kcContext={kcContext}>
                {message && (
                    <div
                        role="alert"
                        style={{
                            padding: '1rem',
                            borderRadius: '0.5rem',
                            backgroundColor:
                                message.type === 'error'
                                    ? 'var(--hw-color-negative-50)'
                                    : 'var(--hw-color-positive-50)',
                            color:
                                message.type === 'error'
                                    ? 'var(--hw-color-negative-900)'
                                    : 'var(--hw-color-positive-900)',
                            marginBottom: '1rem',
                        }}
                    >
                        {message.summary}
                    </div>
                )}

                <form
                    id="kc-otp-login-form"
                    action={kcContext.url.loginAction}
                    method="post"
                    style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                >
                    {hasMultipleSources ? (
                        <>
                            <input type="hidden" name="selectedCredentialId" value={selectedCredentialId} />

                            <div className="mb-6">
                                <FormFieldLayout label={t('selectAuthenticatorTitle')} required>
                                    {({ id, ariaAttributes }) => (
                                        <SelectUncontrolled
                                            id={id}
                                            value={selectedCredentialId}
                                            onValueChange={(value) => setSelectedCredentialId(value)}
                                            onEditComplete={() => { }}
                                            {...ariaAttributes}
                                        >
                                            {credentials.map((c) => (
                                                <SelectOption key={c.id} value={c.id}>
                                                    {c.userLabel}
                                                </SelectOption>
                                            ))}
                                        </SelectUncontrolled>
                                    )}
                                </FormFieldLayout>
                            </div>
                        </>
                    ) : credentials.length === 1 ? (
                        <input type="hidden" name="selectedCredentialId" value={credentials[0].id} />
                    ) : null}

                    <div className="mb-6">
                        <FormFieldLayout label={t('otp')} invalidDescription={translateError(otpError)} required>
                            {({ id, ariaAttributes }) => (
                                <Input
                                    id={id}
                                    name="otp"
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    autoFocus
                                    autoComplete="one-time-code"
                                    required
                                    {...ariaAttributes}
                                />
                            )}
                        </FormFieldLayout>
                    </div>

                    <Button type="submit" color="primary">
                        {t('doLogIn')}
                    </Button>
                </form>
            </PageLayout>
        </Template>
    )
}

