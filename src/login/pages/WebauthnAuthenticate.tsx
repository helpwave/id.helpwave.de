import { Button } from '@helpwave/hightide'
import type { KcContext } from '../KcContext'
import { useI18n } from '../i18n'
import Template from 'keycloakify/login/Template'
import { PageLayout } from '../components/PageLayout'
import { useEffect } from 'react'
import { useTranslation } from '../../i18n/useTranslation'

type WebauthnAuthenticateProps = {
    kcContext: Extract<KcContext, { pageId: 'webauthn-authenticate.ftl' }>,
};

export default function WebauthnAuthenticate({ kcContext }: WebauthnAuthenticateProps) {
    const { i18n } = useI18n({ kcContext })
    const locale = kcContext.locale?.currentLanguageTag ?? 'en'
    const t = useTranslation(locale)

    useEffect(() => {
        const script = document.createElement('script')
        script.src = kcContext.url.webauthnScriptUrl
        script.async = true
        document.body.appendChild(script)

        return () => {
            document.body.removeChild(script)
        }
    }, [kcContext.url.webauthnScriptUrl])

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
                    <p>{t('webauthnAuthenticateMessage')}</p>

                    <form id="kc-webauthn-authenticate-form" action={kcContext.url.loginAction} method="POST" style={{ display: 'none' }}>
                        <Button type="submit" color="primary">
                            {t('doContinue')}
                        </Button>
                    </form>
                </div>
            </PageLayout>
        </Template>
    )
}
