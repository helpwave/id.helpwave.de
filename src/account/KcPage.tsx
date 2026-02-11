import { Suspense } from 'react'
import type { KcContext } from './KcContext'
import { AccountPageLayout } from './components/AccountPageLayout'
import AccountSettings from './pages/AccountSettings'
import AccountPassword from './pages/AccountPassword'

export default function KcPage(props: { kcContext: KcContext }) {
    const { kcContext } = props

    return (
        <Suspense>
            {(() => {
                if (kcContext.pageId === 'account.ftl') {
                    return (
                        <AccountPageLayout kcContext={kcContext}>
                            <AccountSettings
                                kcContext={kcContext}
                            />
                        </AccountPageLayout>
                    )
                }

                if (kcContext.pageId === 'password.ftl') {
                    return (
                        <AccountPageLayout kcContext={kcContext}>
                            <AccountPassword kcContext={kcContext} />
                        </AccountPageLayout>
                    )
                }

                return (
                    <AccountPageLayout kcContext={kcContext}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <a
                                href={kcContext.url.accountUrl}
                                className="text-[var(--color-primary-hover)] underline"
                            >
                                Back to Account
                            </a>
                        </div>
                    </AccountPageLayout>
                )
            })()}
        </Suspense>
    )
}
