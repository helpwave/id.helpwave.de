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
    const locale = kcContext.locale?.currentLanguageTag ?? 'en'
    const t = useTranslation(locale)

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
                            {t('doOverride')}
                        </Button>
                        <Button type="submit" name="submitAction" value="Cancel" color="secondary">
                            {t('doCancel')}
                        </Button>
                    </form>
                </div>
            </PageLayout>
        </Template>
    )
}
