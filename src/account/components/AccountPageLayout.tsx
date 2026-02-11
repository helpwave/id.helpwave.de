import type { ReactNode } from 'react'
import type { KcContext } from '../KcContext'
import { Branding } from '../../login/components/Branding'
import { ThemeSwitcher } from '../../login/components/ThemeSwitcher'
import { LanguageSwitcher } from '../../login/components/LanguageSwitcher'
import { Footer } from '../../login/components/Footer'
import { hideKeycloakStyles } from '../../login/utils/hideKeycloakStyles'
import { LogOut } from 'lucide-react'
import { Button } from '@helpwave/hightide'
import { useTranslation } from '../../i18n/useTranslation'

type AccountPageLayoutProps = {
    kcContext: KcContext,
    children: ReactNode,
}

export function AccountPageLayout({ kcContext, children }: AccountPageLayoutProps) {
    const t = useTranslation()

    return (
        <>
            <style>{hideKeycloakStyles}</style>
            <div className="flex flex-col min-h-screen p-4 relative">
                <div className="absolute top-4 right-4 flex gap-2 z-[1000] sm:top-2 sm:right-2 sm:gap-1 items-center">
                    <ThemeSwitcher />
                    <LanguageSwitcher />
                    <Button
                        type="button"
                        color="negative"
                        coloringStyle="outline"
                        onClick={() => {
                            window.location.href = kcContext.url.getLogoutUrl()
                        }}
                    >
                        <LogOut className="w-4 h-4" style={{ color: 'var(--hw-color-negative-600)' }} />
                        {t('doLogout')}
                    </Button>
                </div>

                <div className="flex flex-col items-center justify-center flex-1 w-[360px] max-w-[360px] mx-auto py-8 px-4 md:w-full md:max-w-[360px] md:py-6 md:px-4 sm:w-full sm:max-w-full sm:py-4 sm:px-2">
                    <Branding animate="none" />

                    <div className="w-full max-w-full box-border [&_form]:w-full [&_form]:max-w-full [&_form]:box-border [&_>*]:w-full [&_>*]:max-w-full [&_>*]:box-border [&_input]:w-full [&_input]:max-w-full [&_input]:box-border [&_button]:w-full [&_button]:max-w-full [&_button]:box-border">
                        {children}
                    </div>
                </div>

                <Footer />
            </div>
        </>
    )
}
