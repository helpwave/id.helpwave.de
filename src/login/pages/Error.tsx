import type { KcContext } from '../KcContext'
import { useI18n } from '../i18n'
import Template from 'keycloakify/login/Template'
import { PageLayout } from '../components/PageLayout'
import { AlertBox } from '../components/AlertBox'
import { useTranslation } from '../../i18n/useTranslation'

type ErrorProps = {
    kcContext: Extract<KcContext, { pageId: 'error.ftl' }>,
};

export default function Error({ kcContext }: ErrorProps) {
    const { i18n } = useI18n({ kcContext })
    const t = useTranslation()
    const documentTitle = `${t('pageTitlePageDisabled')} | ${t('helpwaveId')}`

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            displayMessage={false}
            headerNode={null}
            doUseDefaultCss={false}
            documentTitle={documentTitle}
        >
            <PageLayout kcContext={kcContext}>
                <h1 className="text-xl font-bold text-center mb-4">{t('pageTitlePageDisabled')}</h1>
                {kcContext.message && <AlertBox message={kcContext.message} />}
            </PageLayout>
        </Template>
    )
}