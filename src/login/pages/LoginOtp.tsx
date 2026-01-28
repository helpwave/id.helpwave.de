import { useState } from 'react'
import { Button, Input, FormFieldLayout } from '@helpwave/hightide'
import type { KcContext } from '../KcContext'
import { useI18n } from '../i18n'
import Template from 'keycloakify/login/Template'
import { PageLayout } from '../components/PageLayout'
import { useTranslation } from '../../i18n/useTranslation'

type LoginOtpProps = {
    kcContext: Extract<KcContext, { pageId: 'login-otp.ftl' }>,
};

export default function LoginOtp({ kcContext }: LoginOtpProps) {
    const { i18n } = useI18n({ kcContext })
    const locale = kcContext.locale?.currentLanguageTag ?? 'en'
    const t = useTranslation(locale)
    const [otp, setOtp] = useState('')

    const otpError = kcContext.messagesPerField?.existsError('otp')
        ? kcContext.messagesPerField.get('otp')
        : undefined

    const message = kcContext.message

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
                            marginBottom: '1rem'
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
                    <FormFieldLayout
                        label={t('otp')}
                        invalidDescription={otpError}
                        required
                    >
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

                    <Button type="submit" color="primary">
                        {t('doLogIn')}
                    </Button>
                </form>
            </PageLayout>
        </Template>
    )
}