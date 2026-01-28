import { Button } from '@helpwave/hightide'
import type { KcContext } from '../KcContext'
import { useI18n } from '../i18n'
import Template from 'keycloakify/login/Template'
import { PageLayout } from '../components/PageLayout'
import { useTranslation } from '../../i18n/useTranslation'

type SelectOrganizationProps = {
    kcContext: Extract<KcContext, { pageId: 'select-organization.ftl' }>,
};

export default function SelectOrganization({ kcContext }: SelectOrganizationProps) {
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
                    <h2>{t('selectOrganizationTitle')}</h2>

                    {kcContext.orgs?.orgs && kcContext.orgs.orgs.length > 0 && (
                        <form action={kcContext.url.loginAction} method="POST" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {kcContext.orgs.orgs.map((org) => (
                                <Button
                                    key={org.id}
                                    type="submit"
                                    name="orgId"
                                    value={org.id}
                                    color="primary"
                                >
                                    {org.name}
                                </Button>
                            ))}
                        </form>
                    )}
                </div>
            </PageLayout>
        </Template>
    )
}
