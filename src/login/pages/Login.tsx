import { useState } from 'react'
import { Button, Input, FormFieldLayout, CheckboxUncontrolled } from '@helpwave/hightide'
import type { KcContext } from '../KcContext'
import { useI18n } from '../i18n'
import Template from 'keycloakify/login/Template'
import { PageLayout } from '../components/PageLayout'
import { useTranslation } from '../../i18n/useTranslation'
import { useTranslatedFieldError } from '../utils/translateFieldError'

type LoginProps = {
    kcContext: Extract<KcContext, { pageId: 'login.ftl' }>,
};

export default function Login({ kcContext }: LoginProps) {
    const { i18n } = useI18n({ kcContext })
    const t = useTranslation()
    const translateError = useTranslatedFieldError()
    const [username, setUsername] = useState(kcContext.login?.username ?? '')
    const [password, setPassword] = useState('')
    const [rememberMe, setRememberMe] = useState(false)

    const usernameError = kcContext.messagesPerField?.existsError('username', 'password')
        ? kcContext.messagesPerField.get('username') || kcContext.messagesPerField.get('password')
        : undefined

    const passwordError = kcContext.messagesPerField?.existsError('username', 'password')
        ? kcContext.messagesPerField.get('password') || kcContext.messagesPerField.get('username')
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
                                    : message.type === 'warning'
                                      ? 'var(--hw-color-warning-50)'
                                      : 'var(--hw-color-positive-50)',
                            color:
                                message.type === 'error'
                                    ? 'var(--hw-color-negative-900)'
                                    : message.type === 'warning'
                                      ? 'var(--hw-color-warning-900)'
                                      : 'var(--hw-color-positive-900)',
                            marginBottom: '1rem'
                        }}
                    >
                        {message.summary}
                    </div>
                )}

                <form
                    id="kc-form-login"
                    onSubmit={(e) => {
                        e.preventDefault()
                        const form = e.currentTarget
                        const action = kcContext.url.loginAction
                        if (action) {
                            form.action = action
                            form.method = 'post'
                            form.submit()
                        }
                    }}
                    style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                >
                    <div className="mb-6">
                        <FormFieldLayout
                            label={t(
                                kcContext.realm?.loginWithEmailAllowed
                                    ? 'usernameOrEmail'
                                    : 'username'
                            )}
                            invalidDescription={translateError(usernameError)}
                            required
                        >
                            {({ id, ariaAttributes }) => (
                                <Input
                                    id={id}
                                    name="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    autoFocus
                                    autoComplete="username"
                                    required
                                    disabled={false}
                                    {...ariaAttributes}
                                />
                            )}
                        </FormFieldLayout>
                    </div>

                    <div className="mb-6">
                        <FormFieldLayout
                            label={t('password')}
                            invalidDescription={translateError(passwordError)}
                            required
                        >
                            {({ id, ariaAttributes }) => (
                                <Input
                                    id={id}
                                    name="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="current-password"
                                    required
                                    {...ariaAttributes}
                                />
                            )}
                        </FormFieldLayout>
                    </div>

                    {kcContext.realm?.rememberMe && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <CheckboxUncontrolled
                                value={rememberMe}
                                onValueChange={(value) => setRememberMe(value)}
                                onEditComplete={() => {}}
                                size="md"
                            />
                            <label htmlFor="rememberMe">{t('rememberMe')}</label>
                        </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <Button type="submit" color="primary">
                            {t('doLogIn')}
                        </Button>

                        {kcContext.realm?.resetPasswordAllowed && (
                            <Button
                                type="button"
                                color="neutral"
                                onClick={() => {
                                    window.location.href = kcContext.url.loginResetCredentialsUrl
                                }}
                            >
                                {t('doForgotPassword')}
                            </Button>
                        )}

                        {kcContext.realm?.registrationAllowed && (
                            <Button
                                type="button"
                                color="neutral"
                                onClick={() => {
                                    window.location.href = kcContext.url.registrationUrl
                                }}
                            >
                                {t('noAccount')} {t('doRegister')}
                            </Button>
                        )}
                    </div>
                </form>

                {kcContext.social?.providers && kcContext.social.providers.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
                        <div>{t('identity-provider-redirector')}</div>
                        {kcContext.social.providers.map((provider) => (
                            <Button
                                key={provider.alias}
                                type="button"
                                color="neutral"
                                onClick={() => {
                                    window.location.href = provider.loginUrl
                                }}
                            >
                                {provider.displayName}
                            </Button>
                        ))}
                    </div>
                )}
            </PageLayout>
        </Template>
    )
}