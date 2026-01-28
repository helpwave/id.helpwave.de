import { useState } from 'react'
import { Button, Input, FormFieldLayout, CheckboxUncontrolled } from '@helpwave/hightide'
import type { KcContext } from '../KcContext'
import { useI18n } from '../i18n'
import Template from 'keycloakify/login/Template'
import { RealmChip } from '../components/RealmChip'

type LoginProps = {
    kcContext: Extract<KcContext, { pageId: 'login.ftl' }>,
};

export default function Login({ kcContext }: LoginProps) {
    const { i18n } = useI18n({ kcContext })
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
        <>
            <style>{`
                #kc-header,
                #kc-header-wrapper,
                .kc-header,
                .kc-logo-text,
                [id*="kc-logo"],
                [class*="kc-logo"],
                [id*="header"],
                [class*="header"]:not([class*="Helpwave"]):not([class*="helpwave"]),
                [id*="brand"],
                [class*="brand"],
                [id*="kc-brand"],
                [class*="kc-brand"] {
                    display: none !important;
                }
            `}</style>
            <Template
                kcContext={kcContext}
                i18n={i18n}
                displayMessage={!!message}
                headerNode={null}
                doUseDefaultCss={false}
            >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    width: '100%',
                    maxWidth: '400px',
                    margin: '0 auto',
                    padding: '1rem'
                }}
            >
                <RealmChip kcContext={kcContext} />

                {message && (
                    <div
                        role="alert"
                        style={{
                            padding: '1rem',
                            borderRadius: '0.5rem',
                            backgroundColor:
                                message.type === 'error'
                                    ? 'var(--hw-color-negative-50, #fee)'
                                    : message.type === 'warning'
                                      ? 'var(--hw-color-warning-50, #ffa)'
                                      : 'var(--hw-color-positive-50, #efe)',
                            color:
                                message.type === 'error'
                                    ? 'var(--hw-color-negative-900, #c00)'
                                    : message.type === 'warning'
                                      ? 'var(--hw-color-warning-900, #880)'
                                      : 'var(--hw-color-positive-900, #060)',
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
                    <FormFieldLayout
                        label={i18n.msgStr(
                            kcContext.realm?.loginWithEmailAllowed
                                ? 'usernameOrEmail'
                                : 'username'
                        )}
                        invalidDescription={usernameError}
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

                    <FormFieldLayout
                        label={i18n.msgStr('password')}
                        invalidDescription={passwordError}
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

                    {kcContext.realm?.rememberMe && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <CheckboxUncontrolled
                                value={rememberMe}
                                onValueChange={(value) => setRememberMe(value)}
                                onEditComplete={() => {}}
                                size="md"
                            />
                            <label htmlFor="rememberMe">{i18n.msgStr('rememberMe')}</label>
                        </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <Button type="submit" color="primary">
                            {i18n.msgStr('doLogIn')}
                        </Button>

                        {kcContext.realm?.resetPasswordAllowed && (
                            <Button
                                type="button"
                                color="secondary"
                                onClick={() => {
                                    window.location.href = kcContext.url.loginResetCredentialsUrl
                                }}
                            >
                                {i18n.msgStr('doForgotPassword')}
                            </Button>
                        )}

                        {kcContext.realm?.registrationAllowed && (
                            <Button
                                type="button"
                                color="secondary"
                                onClick={() => {
                                    window.location.href = kcContext.url.registrationUrl
                                }}
                            >
                                {i18n.msgStr('noAccount')} {i18n.msgStr('doRegister')}
                            </Button>
                        )}
                    </div>
                </form>

                {kcContext.social?.providers && kcContext.social.providers.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div>{i18n.msgStr('identity-provider-redirector')}</div>
                        {kcContext.social.providers.map((provider) => (
                            <Button
                                key={provider.alias}
                                type="button"
                                color="secondary"
                                onClick={() => {
                                    window.location.href = provider.loginUrl
                                }}
                            >
                                {provider.displayName}
                            </Button>
                        ))}
                    </div>
                )}
            </div>
        </Template>
        </>
    )
}