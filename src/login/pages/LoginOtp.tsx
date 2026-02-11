import { useState } from 'react'
import { LogIn } from 'lucide-react'
import { Button, Input, FormFieldLayout, Select, SelectOption } from '@helpwave/hightide'
import type { KcContext } from '../KcContext'
import { useI18n } from '../i18n'
import Template from 'keycloakify/login/Template'
import { PageLayout } from '../components/PageLayout'
import { AlertBox } from '../components/AlertBox'
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
                {message && <AlertBox message={message} />}

                <form
                    id="kc-otp-login-form"
                    action={kcContext.url.loginAction}
                    method="post"
                    style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                >
                    {hasMultipleSources ? (
                        <>
                            <input type="hidden" name="selectedCredentialId" value={selectedCredentialId} />

                            <div className="mb-4">
                                <FormFieldLayout label={t('selectAuthenticatorTitle')} required>
                                    {({ id, ariaAttributes }) => (
                                        <Select
                                            id={id}
                                            value={selectedCredentialId}
                                            onValueChange={(value: string) => setSelectedCredentialId(value)}
                                            onEditComplete={() => {}}
                                            {...ariaAttributes}
                                        >
                                            {credentials.map((c) => (
                                                <SelectOption key={c.id} value={c.id}>
                                                    {c.userLabel}
                                                </SelectOption>
                                            ))}
                                        </Select>
                                    )}
                                </FormFieldLayout>
                            </div>
                        </>
                    ) : credentials.length === 1 ? (
                        <input type="hidden" name="selectedCredentialId" value={credentials[0].id} />
                    ) : null}

                    <div className="mb-4">
                        <FormFieldLayout label={t('otp')} invalidDescription={translateError(otpError)} required>
                            {({ id, ariaAttributes }) => (
                                <Input
                                    id={id}
                                    name="otp"
                                    type="text"
                                    value={otp}
                                    onValueChange={(v) => setOtp(v)}
                                    onEditComplete={() => {}}
                                    autoFocus
                                    autoComplete="one-time-code"
                                    required
                                    {...ariaAttributes}
                                />
                            )}
                        </FormFieldLayout>
                    </div>

                    <Button type="submit" color="primary">
                        <LogIn className="w-4 h-4" />
                        {t('doLogIn')}
                    </Button>
                </form>
            </PageLayout>
        </Template>
    )
}

