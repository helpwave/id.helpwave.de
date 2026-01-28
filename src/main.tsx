import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import { KcPage } from './kc.gen'
import '@helpwave/hightide/style/globals.css'
import './index.css'
import { HelpwaveLogo, ThemeProvider, LocaleProvider } from '@helpwave/hightide'

function mapKeycloakLocaleToHightide(keycloakLocale?: string): 'en-US' | 'de-DE' | 'system' {
    if (!keycloakLocale) return 'system'
    const normalized = keycloakLocale.toLowerCase()
    if (normalized.startsWith('de')) return 'de-DE'
    if (normalized.startsWith('en')) return 'en-US'
    return 'system'
}

// The following block can be uncommented to test a specific page with `yarn dev`
// Don't forget to comment back or your bundle size will increase
/*
import { getKcContextMock } from "./login/KcPageStory";

if (import.meta.env.DEV) {
    window.kcContext = getKcContextMock({
        pageId: "register.ftl",
        overrides: {}
    });
}
*/

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ThemeProvider>
            <LocaleProvider locale={mapKeycloakLocaleToHightide(window.kcContext?.locale?.currentLanguageTag)}>
                {!window.kcContext ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                        <HelpwaveLogo animate="loading" color="currentColor" height={128} width={128} />
                    </div>
                ) : (
                    <KcPage kcContext={window.kcContext} />
                )}
            </LocaleProvider>
        </ThemeProvider>
    </StrictMode>
)
