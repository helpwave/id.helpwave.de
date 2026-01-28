import { useState } from 'react'
import { Button, Input, FormFieldLayout } from '@helpwave/hightide'
import type { KcContext } from '../KcContext'
import { useI18n } from '../i18n'
import Template from 'keycloakify/login/Template'
import { PageLayout } from '../components/PageLayout'
import { ArrowLeft } from 'lucide-react'
import { useTranslation } from '../../i18n/useTranslation'

type ForgotPasswordProps = {
    kcContext: Extract<KcContext, { pageId: 'login-reset-password.ftl' }>,
};

export default function ForgotPassword({ kcContext }: ForgotPasswordProps) {
    const { i18n } = useI18n({ kcContext })
    const t = useTranslation()
    const [username, setUsername] = useState(kcContext.auth?.attemptedUsername ?? '')

    const usernameError = kcContext.messagesPerField?.existsError('username')
        ? kcContext.messagesPerField.get('username')
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
                    id="kc-reset-password-form"
                    action={kcContext.url.loginAction}
                    method="post"
                    style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                >
                    <FormFieldLayout
                        label={t(
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
                            {t('doSubmit')}
                        </Button>

                        <Button
                            type="button"
                            color="neutral"
                            onClick={() => {
                                window.location.href = kcContext.url.loginUrl
                            }}
                        >
                            <ArrowLeft size={16} style={{ marginRight: '0.5rem', display: 'inline-block' }} />
                            {t('backToLogin')}
                        </Button>
                    </div>
                </form>
            </PageLayout>
        </Template>
    )
}