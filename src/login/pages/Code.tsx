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

type CodeProps = {
    kcContext: Extract<KcContext, { pageId: 'code.ftl' }>,
};

export default function Code({ kcContext }: CodeProps) {
    const { i18n } = useI18n({ kcContext })
    const t = useTranslation()
    const translateError = useTranslatedFieldError()
    const [code, setCode] = useState('')

    const codeError = kcContext.messagesPerField?.existsError('code')
        ? kcContext.messagesPerField.get('code')
        : undefined

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            displayMessage={!!kcContext.message}
            headerNode={null}
            doUseDefaultCss={false}
            documentTitle={t(getPageTitleKey(kcContext.pageId))}
        >
            <PageLayout kcContext={kcContext}>
                {kcContext.message && <AlertBox message={kcContext.message} />}

                <form
                    action={kcContext.url.loginAction}
                    method="post"
                    style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                >
                    <div className="mb-4">
                        <FormFieldLayout
                            label={t('loginOtp') || t('otp')}
                            invalidDescription={translateError(codeError)}
                            required
                        >
                            {({ id, ariaAttributes }) => (
                                <Input
                                    id={id}
                                    name="code"
                                    type="text"
                                    value={code}
                                    onValueChange={(v) => setCode(v)}
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