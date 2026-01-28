import { useState } from 'react'
import { Button, Input, FormFieldLayout } from '@helpwave/hightide'
import type { KcContext } from '../KcContext'
import { useI18n } from '../i18n'
import Template from 'keycloakify/login/Template'
import { PageLayout } from '../components/PageLayout'
import { useTranslation } from '../../i18n/useTranslation'

type LoginUpdatePasswordProps = {
    kcContext: Extract<KcContext, { pageId: 'login-update-password.ftl' }>,
};

export default function LoginUpdatePassword({ kcContext }: LoginUpdatePasswordProps) {
    const { i18n } = useI18n({ kcContext })
    const t = useTranslation()
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')

    const passwordError = kcContext.messagesPerField?.existsError('password')
        ? kcContext.messagesPerField.get('password')
        : undefined

    const passwordConfirmError = kcContext.messagesPerField?.existsError('password-confirm')
        ? kcContext.messagesPerField.get('password-confirm')
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
                    id="kc-passwd-update-form"
                    action={kcContext.url.loginAction}
                    method="post"
                    style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                >
                    <FormFieldLayout
                        label={t('passwordNew')}
                        invalidDescription={passwordError}
                        required
                    >
                        {({ id, ariaAttributes }) => (
                            <Input
                                id={id}
                                name="password-new"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoFocus
                                autoComplete="new-password"
                                required
                                {...ariaAttributes}
                            />
                        )}
                    </FormFieldLayout>

                    <FormFieldLayout
                        label={t('passwordConfirm')}
                        invalidDescription={passwordConfirmError}
                        required
                    >
                        {({ id, ariaAttributes }) => (
                            <Input
                                id={id}
                                name="password-confirm"
                                type="password"
                                value={passwordConfirm}
                                onChange={(e) => setPasswordConfirm(e.target.value)}
                                autoComplete="new-password"
                                required
                                {...ariaAttributes}
                            />
                        )}
                    </FormFieldLayout>

                    <Button type="submit" color="primary">
                        {t('doSubmit')}
                    </Button>
                </form>
            </PageLayout>
        </Template>
    )
}