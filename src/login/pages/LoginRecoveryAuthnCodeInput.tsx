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

type LoginRecoveryAuthnCodeInputProps = {
    kcContext: Extract<KcContext, { pageId: 'login-recovery-authn-code-input.ftl' }>,
};

export default function LoginRecoveryAuthnCodeInput({ kcContext }: LoginRecoveryAuthnCodeInputProps) {
    const { i18n } = useI18n({ kcContext })
    const t = useTranslation()
    const translateError = useTranslatedFieldError()
    const [recoveryCode, setRecoveryCode] = useState('')

    const recoveryCodeError = kcContext.messagesPerField?.existsError('recoveryCode')
        ? kcContext.messagesPerField.get('recoveryCode')
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

                <form
                    action={kcContext.url.loginAction}
                    method="post"
                    style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                >
                    <div className="mb-4">
                        <FormFieldLayout
                            label={t('recoveryCode')}
                            invalidDescription={translateError(recoveryCodeError)}
                            required
                        >
                            {({ id, ariaAttributes }) => (
                                <Input
                                    id={id}
                                    name="recoveryCode"
                                    type="text"
                                    value={recoveryCode}
                                    onValueChange={(v) => setRecoveryCode(v)}
                                    onEditComplete={() => {}}
                                    autoFocus
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
