import { Shield } from 'lucide-react'
import { Button } from '@helpwave/hightide'
import type { KcContext } from '../KcContext'
import { useI18n } from '../i18n'
import Template from 'keycloakify/login/Template'
import { PageLayout } from '../components/PageLayout'
import { useTranslation } from '../../i18n/useTranslation'
import { getPageTitleKey } from '../utils/pageTitles'

type SelectAuthenticatorProps = {
    kcContext: Extract<KcContext, { pageId: 'select-authenticator.ftl' }>,
};

export default function SelectAuthenticator({ kcContext }: SelectAuthenticatorProps) {
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
                    <h2>{t('selectAuthenticatorTitle')}</h2>

                    {kcContext.auth?.authenticationSelections && kcContext.auth.authenticationSelections.length > 0 && (
                        <form action={kcContext.url.loginAction} method="POST" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {kcContext.auth.authenticationSelections.map((selection) => (
                                <Button
                                    key={selection.authExecId}
                                    type="submit"
                                    name="authExecId"
                                    value={selection.authExecId}
                                    color="primary"
                                >
                                    <Shield className="w-4 h-4" />
                                    {selection.displayName}
                                </Button>
                            ))}
                        </form>
                    )}
                </div>
            </PageLayout>
        </Template>
    )
}
