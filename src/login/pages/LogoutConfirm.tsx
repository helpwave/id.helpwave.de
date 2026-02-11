import { LogOut, X } from 'lucide-react'
import { Button } from '@helpwave/hightide'
import type { KcContext } from '../KcContext'
import { useI18n } from '../i18n'
import Template from 'keycloakify/login/Template'
import { PageLayout } from '../components/PageLayout'
import { useTranslation } from '../../i18n/useTranslation'

type LogoutConfirmProps = {
    kcContext: Extract<KcContext, { pageId: 'logout-confirm.ftl' }>,
};

export default function LogoutConfirm({ kcContext }: LogoutConfirmProps) {
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
                    <p>{t('logoutConfirmHeader')}</p>

                    <form action={kcContext.url.logoutConfirmAction} method="POST" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <input type="hidden" name="session_code" value={kcContext.logoutConfirm.code} />
                        <Button type="submit" name="confirmLogout" color="negative">
                            <LogOut className="w-4 h-4" style={{ color: 'var(--hw-color-negative-600)' }} />
                            {t('doLogout')}
                        </Button>
                        <Button type="submit" name="cancelLogout" color="neutral" coloringStyle="outline">
                            <X className="w-4 h-4" />
                            {t('doCancel')}
                        </Button>
                    </form>
                </div>
            </PageLayout>
        </Template>
    )
}