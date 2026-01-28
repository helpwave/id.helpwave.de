import { Button } from '@helpwave/hightide'
import type { KcContext } from '../KcContext'
import { useI18n } from '../i18n'
import Template from 'keycloakify/login/Template'
import { PageLayout } from '../components/PageLayout'
import { useTranslation } from '../../i18n/useTranslation'

type SelectAuthenticatorProps = {
    kcContext: Extract<KcContext, { pageId: 'select-authenticator.ftl' }>,
};

export default function SelectAuthenticator({ kcContext }: SelectAuthenticatorProps) {
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
                    <h2>{t('selectAuthenticatorTitle')}</h2>

                    {kcContext.auth?.authenticators && kcContext.auth.authenticators.length > 0 && (
                        <form action={kcContext.url.loginAction} method="POST" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {kcContext.auth.authenticators.map((authenticator) => (
                                <Button
                                    key={authenticator.alias}
                                    type="submit"
                                    name="selectedCredentialId"
                                    value={authenticator.credentialId}
                                    color="primary"
                                >
                                    {authenticator.displayName ?? authenticator.alias}
                                </Button>
                            ))}
                        </form>
                    )}
                </div>
            </PageLayout>
        </Template>
    )
}
