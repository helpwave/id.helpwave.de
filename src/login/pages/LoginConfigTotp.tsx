import { useState } from 'react'
import { Button, Input, FormFieldLayout } from '@helpwave/hightide'
import type { KcContext } from '../KcContext'
import { useI18n } from '../i18n'
import Template from 'keycloakify/login/Template'
import { PageLayout } from '../components/PageLayout'
import { useTranslation } from '../../i18n/useTranslation'

type LoginConfigTotpProps = {
    kcContext: Extract<KcContext, { pageId: 'login-config-totp.ftl' }>,
};

export default function LoginConfigTotp({ kcContext }: LoginConfigTotpProps) {
    const { i18n } = useI18n({ kcContext })
    const locale = kcContext.locale?.currentLanguageTag ?? 'en'
    const t = useTranslation(locale)
    const [totp, setTotp] = useState('')

    const totpError = kcContext.messagesPerField?.existsError('totp')
        ? kcContext.messagesPerField.get('totp')
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

                {kcContext.totp?.qrUrl && (
                    <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
                        <img src={kcContext.totp.qrUrl} alt="TOTP QR Code" style={{ maxWidth: '200px' }} />
                        <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
                            {t('loginTotpScanBarcode')}
                        </p>
                    </div>
                )}

                <form
                    action={kcContext.url.loginAction}
                    method="post"
                    style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                >
                    <FormFieldLayout
                        label={t('loginTotpOneTime')}
                        invalidDescription={totpError}
                        required
                    >
                        {({ id, ariaAttributes }) => (
                            <Input
                                id={id}
                                name="totp"
                                type="text"
                                value={totp}
                                onChange={(e) => setTotp(e.target.value)}
                                autoFocus
                                autoComplete="one-time-code"
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
