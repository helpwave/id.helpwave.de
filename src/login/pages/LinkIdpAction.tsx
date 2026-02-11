import { ArrowRight } from 'lucide-react'
import { Button } from '@helpwave/hightide'
import type { KcContext } from '../KcContext'
import { useI18n } from '../i18n'
import Template from 'keycloakify/login/Template'
import { PageLayout } from '../components/PageLayout'
import { useEffect } from 'react'
import { useTranslation } from '../../i18n/useTranslation'

type LinkIdpActionProps = {
    kcContext: Extract<KcContext, { pageId: 'link-idp-action.ftl' }>,
};

export default function LinkIdpAction({ kcContext }: LinkIdpActionProps) {
    const { i18n } = useI18n({ kcContext })
    const t = useTranslation()

    useEffect(() => {
        const form = document.getElementById('kc-link-idp-form') as HTMLFormElement
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
                    <p>{t('linkIdpMessage')}</p>

                    <form id="kc-link-idp-form" action={kcContext.url.loginAction} method="POST" style={{ display: 'none' }}>
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
