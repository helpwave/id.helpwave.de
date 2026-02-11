import { ArrowRight } from 'lucide-react'
import { Button } from '@helpwave/hightide'
import type { KcContext } from '../KcContext'
import { useI18n } from '../i18n'
import Template from 'keycloakify/login/Template'
import { PageLayout } from '../components/PageLayout'
import { useEffect } from 'react'
import { useTranslation } from '../../i18n/useTranslation'
import { getPageTitleKey } from '../utils/pageTitles'

type SamlPostFormProps = {
    kcContext: Extract<KcContext, { pageId: 'saml-post-form.ftl' }>,
};

export default function SamlPostForm({ kcContext }: SamlPostFormProps) {
    const { i18n } = useI18n({ kcContext })
    const t = useTranslation()

    useEffect(() => {
        const form = document.getElementById('kc-saml-post-form') as HTMLFormElement
        if (form && kcContext.url.loginAction) {
            form.submit()
        }
    }, [kcContext.url.loginAction])

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
                        id="kc-saml-post-form"
                        action={kcContext.samlPost?.url ?? kcContext.url.loginAction}
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
                        <Button type="submit" color="primary">
                            <ArrowRight className="w-4 h-4" />
                            {t('doContinue')}
                        </Button>
                    </form>
                </div>
            </PageLayout>
        </Template>
    )
}
