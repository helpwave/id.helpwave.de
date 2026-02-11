import { useState } from 'react'
import { ArrowLeft, Send } from 'lucide-react'
import { Button, Input, FormFieldLayout } from '@helpwave/hightide'
import type { KcContext } from '../KcContext'
import { useI18n } from '../i18n'
import Template from 'keycloakify/login/Template'
import { PageLayout } from '../components/PageLayout'
import { AlertBox } from '../components/AlertBox'
import { useTranslation } from '../../i18n/useTranslation'
import { useTranslatedFieldError } from '../utils/translateFieldError'

type ForgotPasswordProps = {
    kcContext: Extract<KcContext, { pageId: 'login-reset-password.ftl' }>,
};

export default function ForgotPassword({ kcContext }: ForgotPasswordProps) {
    const { i18n } = useI18n({ kcContext })
    const t = useTranslation()
    const translateError = useTranslatedFieldError()
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
                {message && <AlertBox message={message} />}

                <form
                    id="kc-reset-password-form"
                    action={kcContext.url.loginAction}
                    method="post"
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
                                    {...ariaAttributes}
                                />
                            )}
                        </FormFieldLayout>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <Button type="submit" color="primary">
                            <Send className="w-4 h-4" />
                            {t('doSubmit')}
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
                            {t('backToLogin')}
                        </Button>
                    </div>
                </form>
            </PageLayout>
        </Template>
    )
}