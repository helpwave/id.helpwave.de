import { useState } from 'react'
import { Button, Input, FormFieldLayout } from '@helpwave/hightide'
import type { KcContext } from '../KcContext'
import { useI18n } from '../i18n'
import Template from 'keycloakify/login/Template'
import { PageLayout } from '../components/PageLayout'
import { useTranslation } from '../../i18n/useTranslation'
import { useTranslatedFieldError } from '../utils/translateFieldError'

type LoginOauth2DeviceVerifyUserCodeProps = {
    kcContext: Extract<KcContext, { pageId: 'login-oauth2-device-verify-user-code.ftl' }>,
};

export default function LoginOauth2DeviceVerifyUserCode({ kcContext }: LoginOauth2DeviceVerifyUserCodeProps) {
    const { i18n } = useI18n({ kcContext })
    const t = useTranslation()
    const translateError = useTranslatedFieldError()
    const [userCode, setUserCode] = useState('')

    const userCodeError = kcContext.messagesPerField?.existsError('userCode')
        ? kcContext.messagesPerField.get('userCode')
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

                <div style={{ marginBottom: '1rem' }}>
                    <p>{t('oauth2DeviceVerifyUserCodeMessage')}</p>
                </div>

                <form
                    action={kcContext.url.loginAction}
                    method="post"
                    style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                >
                    <div className="mb-1.5">
                        <FormFieldLayout
                            label={t('userCode')}
                            invalidDescription={translateError(userCodeError)}
                            required
                        >
                            {({ id, ariaAttributes }) => (
                                <Input
                                    id={id}
                                    name="userCode"
                                    type="text"
                                    value={userCode}
                                    onValueChange={(v) => setUserCode(v)}
                                    onEditComplete={() => {}}
                                    autoFocus
                                    required
                                    {...ariaAttributes}
                                />
                            )}
                        </FormFieldLayout>
                    </div>

                    <Button type="submit" color="primary">
                        {t('doSubmit')}
                    </Button>
                </form>
            </PageLayout>
        </Template>
    )
}
