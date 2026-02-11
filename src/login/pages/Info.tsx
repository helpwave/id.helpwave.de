import { Button } from '@helpwave/hightide'
import type { KcContext } from '../KcContext'
import { useI18n } from '../i18n'
import Template from 'keycloakify/login/Template'
import { PageLayout } from '../components/PageLayout'
import { AlertBox } from '../components/AlertBox'
import { ArrowLeft } from 'lucide-react'
import { useTranslation } from '../../i18n/useTranslation'
import { getDocumentTitle, getMessageHeaderKey } from '../utils/pageTitles'

type InfoProps = {
    kcContext: Extract<KcContext, { pageId: 'info.ftl' }>,
};

export default function Info({ kcContext }: InfoProps) {
    const { i18n } = useI18n({ kcContext })
    const t = useTranslation()
    const messageHeaderKey = kcContext.messageHeader ? getMessageHeaderKey(kcContext.messageHeader) : undefined
    const messageHeaderText = messageHeaderKey ? t(messageHeaderKey) : kcContext.messageHeader

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            displayMessage={false}
            headerNode={null}
            doUseDefaultCss={false}
            documentTitle={getDocumentTitle(kcContext.pageId, t)}
        >
            <PageLayout kcContext={kcContext}>
                {kcContext.message && <AlertBox message={kcContext.message} />}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {messageHeaderText && (
                        <h2>{messageHeaderText}</h2>
                    )}

                    <Button
                        type="button"
                        color="neutral"
                        coloringStyle="outline"
                        onClick={() => {
                            window.location.href = kcContext.url.loginUrl
                        }}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        {t('backToApplication') || t('doContinue')}
                    </Button>
                </div>
            </PageLayout>
        </Template>
    )
}