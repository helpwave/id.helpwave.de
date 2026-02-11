import { ArrowRight } from 'lucide-react'
import { Button } from '@helpwave/hightide'
import type { KcContext } from '../KcContext'
import { useI18n } from '../i18n'
import Template from 'keycloakify/login/Template'
import { PageLayout } from '../components/PageLayout'
import { useTranslation } from '../../i18n/useTranslation'
import { getPageTitleKey } from '../utils/pageTitles'

type LoginX509InfoProps = {
    kcContext: Extract<KcContext, { pageId: 'login-x509-info.ftl' }>,
};

export default function LoginX509Info({ kcContext }: LoginX509InfoProps) {
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
                        <h2>{t('x509InfoTitle')}</h2>
                        <p>{t('x509InfoMessage')}</p>
                    </div>

                    <form action={kcContext.url.loginAction} method="POST" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
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
