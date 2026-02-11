import { Building2 } from 'lucide-react'
import { Button } from '@helpwave/hightide'
import type { KcContext } from '../KcContext'
import { useI18n } from '../i18n'
import Template from 'keycloakify/login/Template'
import { PageLayout } from '../components/PageLayout'
import { useTranslation } from '../../i18n/useTranslation'
import { getPageTitleKey } from '../utils/pageTitles'

type SelectOrganizationProps = {
    kcContext: Extract<KcContext, { pageId: 'select-organization.ftl' }>,
};

export default function SelectOrganization({ kcContext }: SelectOrganizationProps) {
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
                    <h2>{t('selectOrganizationTitle')}</h2>

                    {kcContext.user?.organizations && kcContext.user.organizations.length > 0 && (
                        <form action={kcContext.url.loginAction} method="POST" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {kcContext.user.organizations.map((org) => (
                                <Button
                                    key={org.alias}
                                    type="submit"
                                    name="orgId"
                                    value={org.alias}
                                    color="primary"
                                >
                                    <Building2 className="w-4 h-4" />
                                    {org.name ?? org.alias}
                                </Button>
                            ))}
                        </form>
                    )}
                </div>
            </PageLayout>
        </Template>
    )
}
