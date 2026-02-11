import { Trash2, X } from 'lucide-react'
import { Button } from '@helpwave/hightide'
import type { KcContext } from '../KcContext'
import { useI18n } from '../i18n'
import Template from 'keycloakify/login/Template'
import { PageLayout } from '../components/PageLayout'
import { useTranslation } from '../../i18n/useTranslation'

type DeleteCredentialProps = {
    kcContext: Extract<KcContext, { pageId: 'delete-credential.ftl' }>,
};

export default function DeleteCredential({ kcContext }: DeleteCredentialProps) {
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
                    <p>{t('deleteCredentialConfirm')}</p>

                    <form action={kcContext.url.loginAction} method="POST" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <Button type="submit" name="submitAction" value="Delete" color="primary">
                            <Trash2 className="w-4 h-4" />
                            {t('doDelete')}
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
