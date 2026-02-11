import { ArrowRight } from 'lucide-react'
import { Button } from '@helpwave/hightide'
import type { KcContext } from '../KcContext'
import { useI18n } from '../i18n'
import Template from 'keycloakify/login/Template'
import { PageLayout } from '../components/PageLayout'
import { useTranslation } from '../../i18n/useTranslation'
import { getPageTitleKey } from '../utils/pageTitles'

type LoginResetOtpProps = {
    kcContext: Extract<KcContext, { pageId: 'login-reset-otp.ftl' }>,
};

export default function LoginResetOtp({ kcContext }: LoginResetOtpProps) {
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
                    <p>{t('resetOtpMessage')}</p>

                    <Button
                        type="button"
                        color="primary"
                        onClick={() => {
                            window.location.href = kcContext.url.loginRestartFlowUrl
                        }}
                    >
                        <ArrowRight className="w-4 h-4" />
                        {t('doContinue')}
                    </Button>
                </div>
            </PageLayout>
        </Template>
    )
}
