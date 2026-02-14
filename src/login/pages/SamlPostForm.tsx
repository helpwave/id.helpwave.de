import { ArrowRight } from 'lucide-react'
import { useEffect, useLayoutEffect, useRef } from 'react'
import { Button } from '@helpwave/hightide'
import type { KcContext } from '../KcContext'
import { useI18n } from '../i18n'
import Template from 'keycloakify/login/Template'
import { PageLayout } from '../components/PageLayout'
import { useTranslation } from '../../i18n/useTranslation'
import { getPageTitleKey } from '../utils/pageTitles'

const FORM_ID = 'kc-saml-post-form'

type SamlPostFormProps = {
    kcContext: Extract<KcContext, { pageId: 'saml-post-form.ftl' }>,
};

function submitForm(): boolean {
    const form = document.getElementById(FORM_ID) as HTMLFormElement | null
    if (form) {
        form.submit()
        return true
    }
    return false
}

export default function SamlPostForm({ kcContext }: SamlPostFormProps) {
    const { i18n } = useI18n({ kcContext })
    const t = useTranslation()
    const submittedRef = useRef(false)

    const actionUrl = kcContext.samlPost?.url ?? kcContext.url.loginAction

    useLayoutEffect(() => {
        if (submittedRef.current || !actionUrl) return
        if (submitForm()) {
            submittedRef.current = true
        }
    }, [actionUrl])

    useEffect(() => {
        if (submittedRef.current || !actionUrl) return
        const id = setTimeout(() => {
            if (submittedRef.current) return
            if (submitForm()) {
                submittedRef.current = true
            }
        }, 100)
        return () => clearTimeout(id)
    }, [actionUrl])

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            displayMessage={false}
            headerNode={null}
            doUseDefaultCss={false}
            documentTitle={t(getPageTitleKey(kcContext.pageId))}
        >
            <PageLayout kcContext={kcContext}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <p>{t('samlPostFormMessage')}</p>

                    <form
                        id={FORM_ID}
                        action={actionUrl}
                        method="POST"
                        style={{ display: 'none' }}
                    >
                        {kcContext.samlPost &&
                            (['SAMLRequest', 'SAMLResponse', 'relayState'] as const).map(
                                (name) =>
                                    kcContext.samlPost![name] != null && (
                                        <input
                                            key={name}
                                            type="hidden"
                                            name={name}
                                            value={kcContext.samlPost![name]}
                                        />
                                    )
                            )}
                    </form>

                    <Button
                        type="button"
                        color="primary"
                        onClick={() => submitForm()}
                    >
                        <ArrowRight className="w-4 h-4" />
                        {t('doContinue')}
                    </Button>
                </div>
            </PageLayout>
        </Template>
    )
}
