import { useEffect, useRef } from 'react'
import type { KcContext } from '../KcContext'
import { useI18n } from '../i18n'
import Template from 'keycloakify/login/Template'
import { PageLayout } from '../components/PageLayout'
import { useTranslation } from '../../i18n/useTranslation'
import { getPageTitleKey } from '../utils/pageTitles'

type SamlPostFormProps = {
    kcContext: Extract<KcContext, { pageId: 'saml-post-form.ftl' }>,
}

export default function SamlPostForm({ kcContext }: SamlPostFormProps) {
    const { i18n } = useI18n({ kcContext })
    const { msg } = i18n
    const t = useTranslation()
    const { samlPost } = kcContext

    const formRef = useRef<HTMLFormElement>(null)

    useEffect(() => {
        if (formRef.current) {
            formRef.current.submit()
        }
    }, [])

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={false}
            headerNode={msg('saml.post-form.title')}
            documentTitle={t(getPageTitleKey(kcContext.pageId))}
        >
            <PageLayout kcContext={kcContext}>
                <p>{msg('saml.post-form.message')}</p>

                <form
                    ref={formRef}
                    name="saml-post-binding"
                    method="post"
                    action={samlPost.url}
                    className="hidden"
                >
                    {samlPost.SAMLRequest && (
                        <input type="hidden" name="SAMLRequest" value={samlPost.SAMLRequest} />
                    )}
                    {samlPost.SAMLResponse && (
                        <input type="hidden" name="SAMLResponse" value={samlPost.SAMLResponse} />
                    )}
                    {samlPost.relayState && (
                        <input type="hidden" name="RelayState" value={samlPost.relayState} />
                    )}

                    <noscript>
                        <p>{msg('saml.post-form.js-disabled')}</p>
                        <button type="submit" className="btn">
                            {t('doContinue')}
                        </button>
                    </noscript>
                </form>
            </PageLayout>
        </Template>
    )
}
