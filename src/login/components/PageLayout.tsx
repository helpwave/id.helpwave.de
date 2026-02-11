import type { ReactNode } from 'react'
import type { KcContext } from '../KcContext'
import { Branding } from './Branding'
import { RealmChip } from './RealmChip'
import { ThemeSwitcher } from './ThemeSwitcher'
import { LanguageSwitcher } from './LanguageSwitcher'
import { Footer } from './Footer'
import { hideKeycloakStyles } from '../utils/hideKeycloakStyles'

type PageLayoutProps = {
    kcContext: KcContext,
    children: ReactNode,
}

export function PageLayout({ kcContext, children }: PageLayoutProps) {
    return (
        <>
            <style>{hideKeycloakStyles}</style>
            <div
                className="flex flex-col min-h-screen p-4 relative"
            >
                <div className="absolute top-4 right-4 flex gap-2 z-[1000] sm:top-2 sm:right-2 sm:gap-1">
                    <ThemeSwitcher />
                    <LanguageSwitcher />
                </div>

                <div className="flex flex-col items-center justify-center flex-1 w-[360px] max-w-[360px] mx-auto py-8 px-4 md:w-full md:max-w-[360px] md:py-6 md:px-4 sm:w-full sm:max-w-full sm:py-4 sm:px-2">
                    <Branding />
                    <RealmChip kcContext={kcContext} />

                    <div className="w-full max-w-full box-border [&_form]:w-full [&_form]:max-w-full [&_form]:box-border [&_>*]:w-full [&_>*]:max-w-full [&_>*]:box-border [&_input]:w-full [&_input]:max-w-full [&_input]:box-border [&_button]:w-full [&_button]:max-w-full [&_button]:box-border">
                        {children}
                    </div>
                </div>

                <Footer />
            </div>
        </>
    )
}
