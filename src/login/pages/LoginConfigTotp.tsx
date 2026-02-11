import { useState } from 'react'
import { Send } from 'lucide-react'
import { Button, Input, FormFieldLayout } from '@helpwave/hightide'
import type { KcContext } from '../KcContext'
import { useI18n } from '../i18n'
import Template from 'keycloakify/login/Template'
import { PageLayout } from '../components/PageLayout'
import { AlertBox } from '../components/AlertBox'
import { useTranslation } from '../../i18n/useTranslation'
import { useTranslatedFieldError } from '../utils/translateFieldError'
import { getPageTitleKey } from '../utils/pageTitles'

type LoginConfigTotpProps = {
    kcContext: Extract<KcContext, { pageId: 'login-config-totp.ftl' }>,
};

export default function LoginConfigTotp({ kcContext }: LoginConfigTotpProps) {
    const { i18n } = useI18n({ kcContext })
    const t = useTranslation()
    const translateError = useTranslatedFieldError()
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
            documentTitle={t(getPageTitleKey(kcContext.pageId))}
        >
            <PageLayout kcContext={kcContext}>
                {message && <AlertBox message={message} />}

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
                    <div className="mb-4">
                        <FormFieldLayout
                            label={t('loginTotpOneTime')}
                            invalidDescription={translateError(totpError)}
                            required
                        >
                            {({ id, ariaAttributes }) => (
                                <Input
                                    id={id}
                                    name="totp"
                                    type="text"
                                    value={totp}
                                    onValueChange={(v) => setTotp(v)}
                                    onEditComplete={() => {}}
                                    autoFocus
                                    autoComplete="one-time-code"
                                    required
                                    {...ariaAttributes}
                                />
                            )}
                        </FormFieldLayout>
                    </div>

                    <Button type="submit" color="primary">
                        <Send className="w-4 h-4" />
                        {t('doSubmit')}
                    </Button>
                </form>
            </PageLayout>
        </Template>
    )
}
