import { useState } from 'react'
import { LogIn } from 'lucide-react'
import { Button, Input, FormFieldLayout } from '@helpwave/hightide'
import type { KcContext } from '../KcContext'
import { useI18n } from '../i18n'
import Template from 'keycloakify/login/Template'
import { PageLayout } from '../components/PageLayout'
import { useTranslation } from '../../i18n/useTranslation'
import { useTranslatedFieldError } from '../utils/translateFieldError'

type LoginPasswordProps = {
    kcContext: Extract<KcContext, { pageId: 'login-password.ftl' }>,
};

export default function LoginPassword({ kcContext }: LoginPasswordProps) {
    const { i18n } = useI18n({ kcContext })
    const t = useTranslation()
    const translateError = useTranslatedFieldError()
    const [password, setPassword] = useState('')

    const passwordError = kcContext.messagesPerField?.existsError('password')
        ? kcContext.messagesPerField.get('password')
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
                    action={kcContext.url.loginAction}
                    method="post"
                    style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                >
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
                                    autoFocus
                                    autoComplete="current-password"
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
