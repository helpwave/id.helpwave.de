import { ArrowRight } from 'lucide-react'
import { Button } from '@helpwave/hightide'
import type { KcContext } from '../KcContext'
import { useI18n } from '../i18n'
import Template from 'keycloakify/login/Template'
import { PageLayout } from '../components/PageLayout'
import { useEffect } from 'react'
import { useTranslation } from '../../i18n/useTranslation'

type WebauthnRegisterProps = {
    kcContext: Extract<KcContext, { pageId: 'webauthn-register.ftl' }>,
};

export default function WebauthnRegister({ kcContext }: WebauthnRegisterProps) {
    const { i18n } = useI18n({ kcContext })
    const t = useTranslation()

    const webauthnScriptUrl = (kcContext.url as { webauthnScriptUrl?: string }).webauthnScriptUrl
    useEffect(() => {
        if (!webauthnScriptUrl) return
        const script = document.createElement('script')
        script.src = webauthnScriptUrl
        script.async = true
        document.body.appendChild(script)
        return () => {
            document.body.removeChild(script)
        }
    }, [webauthnScriptUrl])

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
                    <p>{t('webauthnRegisterMessage')}</p>

                    <form id="kc-webauthn-register-form" action={kcContext.url.loginAction} method="POST" style={{ display: 'none' }}>
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
