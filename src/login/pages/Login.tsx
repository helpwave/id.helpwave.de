import { useState } from 'react'
import { LogIn, KeyRound, UserPlus } from 'lucide-react'
import { Button, Input, FormFieldLayout, Checkbox } from '@helpwave/hightide'
import type { KcContext } from '../KcContext'
import { useI18n } from '../i18n'
import Template from 'keycloakify/login/Template'
import { PageLayout } from '../components/PageLayout'
import { AlertBox } from '../components/AlertBox'
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
                {message && <AlertBox message={message} />}

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
                    <div className="mb-4">
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
                                    onValueChange={(v) => setUsername(v)}
                                    onEditComplete={() => {}}
                                    autoFocus
                                    autoComplete="username"
                                    required
                                    disabled={false}
                                    {...ariaAttributes}
                                />
                            )}
                        </FormFieldLayout>
                    </div>

                    <div className="mb-4">
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
                                    onValueChange={(v) => setPassword(v)}
                                    onEditComplete={() => {}}
                                    autoComplete="current-password"
                                    required
                                    {...ariaAttributes}
                                />
                            )}
                        </FormFieldLayout>
                    </div>

                    {kcContext.realm?.rememberMe && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Checkbox
                                value={rememberMe}
                                onValueChange={(value: boolean) => setRememberMe(value)}
                                onEditComplete={() => {}}
                                size="md"
                            />
                            <label htmlFor="rememberMe">{t('rememberMe')}</label>
                        </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <Button type="submit" color="primary">
                            <LogIn className="w-4 h-4" />
                            {t('doLogIn')}
                        </Button>

                        {kcContext.realm?.resetPasswordAllowed && (
                            <Button
                                type="button"
                                color="neutral"
                                coloringStyle="outline"
                                onClick={() => {
                                    window.location.href = kcContext.url.loginResetCredentialsUrl
                                }}
                            >
                                <KeyRound className="w-4 h-4" />
                                {t('doForgotPassword')}
                            </Button>
                        )}

                        {kcContext.realm?.registrationAllowed && (
                            <Button
                                type="button"
                                color="neutral"
                                coloringStyle="outline"
                                onClick={() => {
                                    window.location.href = kcContext.url.registrationUrl
                                }}
                            >
                                <UserPlus className="w-4 h-4" />
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
                                coloringStyle="outline"
                                onClick={() => {
                                    window.location.href = provider.loginUrl
                                }}
                            >
                                <LogIn className="w-4 h-4" />
                                {provider.displayName}
                            </Button>
                        ))}
                    </div>
                )}
            </PageLayout>
        </Template>
    )
}