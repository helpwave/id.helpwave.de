import { Check, X } from 'lucide-react'
import { Button } from '@helpwave/hightide'
import type { KcContext } from '../KcContext'
import { useI18n } from '../i18n'
import Template from 'keycloakify/login/Template'
import { PageLayout } from '../components/PageLayout'
import { useTranslation } from '../../i18n/useTranslation'
import { getPageTitleKey } from '../utils/pageTitles'

type LoginOauthGrantProps = {
    kcContext: Extract<KcContext, { pageId: 'login-oauth-grant.ftl' }>,
};

export default function LoginOauthGrant({ kcContext }: LoginOauthGrantProps) {
    const { i18n } = useI18n({ kcContext })
    const t = useTranslation()

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
                    <div>
                        <h2>{t('oauthGrantTitle')}</h2>
                        <p>{t('oauthGrantMessage')}</p>
                    </div>

                    {kcContext.oauth?.clientScopesRequested && kcContext.oauth.clientScopesRequested.length > 0 && (
                        <div style={{ marginBottom: '1rem' }}>
                            <h3>{t('oauthGrantScopes')}</h3>
                            <ul>
                                {kcContext.oauth.clientScopesRequested.map((scope, index) => (
                                    <li key={scope.dynamicScopeParameter ?? index}>{scope.consentScreenText}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <form action={kcContext.url.loginAction} method="POST" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <Button type="submit" name="accept" color="primary">
                            <Check className="w-4 h-4" />
                            {t('doAccept')}
                        </Button>
                        <Button type="submit" name="cancel" color="neutral" coloringStyle="outline">
                            <X className="w-4 h-4" />
                            {t('doCancel')}
                        </Button>
                    </form>
                </div>
            </PageLayout>
        </Template>
    )
}
