import { Button } from '@helpwave/hightide'
import type { KcContext } from '../KcContext'
import { useI18n } from '../i18n'
import Template from 'keycloakify/login/Template'
import { PageLayout } from '../components/PageLayout'
import { useEffect } from 'react'
import { useTranslation } from '../../i18n/useTranslation'

type SamlPostFormProps = {
    kcContext: Extract<KcContext, { pageId: 'saml-post-form.ftl' }>,
};

export default function SamlPostForm({ kcContext }: SamlPostFormProps) {
    const { i18n } = useI18n({ kcContext })
    const locale = kcContext.locale?.currentLanguageTag ?? 'en'
    const t = useTranslation(locale)

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
        >
            <PageLayout kcContext={kcContext}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <p>{t('samlPostFormMessage')}</p>

                    <form id="kc-saml-post-form" action={kcContext.url.loginAction} method="POST" style={{ display: 'none' }}>
                        {kcContext.samlPost?.map((field) => (
                            <input key={field.name} type="hidden" name={field.name} value={field.value} />
                        ))}
                        <Button type="submit" color="primary">
                            {t('doContinue')}
                        </Button>
                    </form>
                </div>
            </PageLayout>
        </Template>
    )
}
