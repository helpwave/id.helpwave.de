import { useState } from 'react'
import { Button, Input, FormFieldLayout } from '@helpwave/hightide'
import type { KcContext } from '../KcContext'
import { useI18n } from '../i18n'
import Template from 'keycloakify/login/Template'
import { RealmChip } from '../components/RealmChip'

type ForgotPasswordProps = {
    kcContext: Extract<KcContext, { pageId: 'login-reset-password.ftl' }>,
};

export default function ForgotPassword({ kcContext }: ForgotPasswordProps) {
    const { i18n } = useI18n({ kcContext })
    const [username, setUsername] = useState(kcContext.auth?.attemptedUsername ?? '')

    const usernameError = kcContext.messagesPerField?.existsError('username')
        ? kcContext.messagesPerField.get('username')
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
                    id="kc-reset-password-form"
                    action={kcContext.url.loginAction}
                    method="post"
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
                                {...ariaAttributes}
                            />
                        )}
                    </FormFieldLayout>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <Button type="submit" color="primary">
                            {i18n.msgStr('doSubmit')}
                        </Button>

                        <Button
                            type="button"
                            color="secondary"
                            onClick={() => {
                                window.location.href = kcContext.url.loginUrl
                            }}
                        >
                            {i18n.msgStr('backToLogin')}
                        </Button>
                    </div>
                </form>
            </div>
        </Template>
        </>
    )
}