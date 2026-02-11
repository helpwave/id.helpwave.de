import { RefreshCw, X } from 'lucide-react'
import { Button } from '@helpwave/hightide'
import type { KcContext } from '../KcContext'
import { useI18n } from '../i18n'
import Template from 'keycloakify/login/Template'
import { PageLayout } from '../components/PageLayout'
import { useTranslation } from '../../i18n/useTranslation'

type LoginIdpLinkConfirmOverrideProps = {
    kcContext: Extract<KcContext, { pageId: 'login-idp-link-confirm-override.ftl' }>,
};

export default function LoginIdpLinkConfirmOverride({ kcContext }: LoginIdpLinkConfirmOverrideProps) {
    const { i18n } = useI18n({ kcContext })
    const t = useTranslation()

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
                    <p>{t('idpLinkConfirmOverrideMessage')}</p>

                    <form action={kcContext.url.loginAction} method="POST" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <Button type="submit" name="submitAction" value="Override" color="primary">
                            <RefreshCw className="w-4 h-4" />
                            {t('doOverride')}
                        </Button>
                        <Button type="submit" name="submitAction" value="Cancel" color="neutral" coloringStyle="outline">
                            <X className="w-4 h-4" />
                            {t('doCancel')}
                        </Button>
                    </form>
                </div>
            </PageLayout>
        </Template>
    )
}
