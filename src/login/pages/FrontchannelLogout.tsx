import { Button } from '@helpwave/hightide'
import type { KcContext } from '../KcContext'
import { useI18n } from '../i18n'
import Template from 'keycloakify/login/Template'
import { PageLayout } from '../components/PageLayout'
import { useEffect } from 'react'
import { useTranslation } from '../../i18n/useTranslation'

type FrontchannelLogoutProps = {
    kcContext: Extract<KcContext, { pageId: 'frontchannel-logout.ftl' }>,
};

export default function FrontchannelLogout({ kcContext }: FrontchannelLogoutProps) {
    const { i18n } = useI18n({ kcContext })
    const t = useTranslation()

    useEffect(() => {
        const form = document.getElementById('kc-frontchannel-logout-form') as HTMLFormElement
        if (form) {
            form.submit()
        }
    }, [])

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
                    <p>{t('frontchannelLogoutMessage')}</p>

                    <form
                        id="kc-frontchannel-logout-form"
                        action={(kcContext.url as { logoutAction?: string }).logoutAction ?? '#'}
                        method="POST"
                        style={{ display: 'none' }}
                    >
                        {kcContext.logout.clients.map((client) => (
                            <iframe
                                key={client.frontChannelLogoutUrl}
                                src={client.frontChannelLogoutUrl}
                                style={{ display: 'none' }}
                            />
                        ))}
                        <Button type="submit" color="primary">
                            {t('doContinue')}
                        </Button>
                    </form>
                </div>
            </PageLayout>
        </Template>
    )
}
