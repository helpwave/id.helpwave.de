import { Suspense } from 'react'
import type { KcContext } from './KcContext'
import { AccountPageLayout } from './components/AccountPageLayout'
import AccountSettings from './pages/AccountSettings'

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

                return (
                    <AccountPageLayout kcContext={kcContext}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <p>
                                {kcContext.pageId === 'password.ftl'
                                    ? 'Use the link below to update your password.'
                                    : 'Use the link below to return to your account.'}
                            </p>
                            {kcContext.pageId === 'password.ftl' && (
                                <a
                                    href={kcContext.url.passwordUrl}
                                    className="text-[var(--hw-color-primary-600)] underline"
                                >
                                    Update Password
                                </a>
                            )}
                            <a
                                href={kcContext.url.accountUrl}
                                className="text-[var(--hw-color-primary-600)] underline"
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
