import { useEffect } from 'react'
import { ShieldAlert, Users, Tag } from 'lucide-react'
import { getRealmTheme, type RealmKind } from '../utils/realmColor'
import { useTranslation } from '../../i18n/useTranslation'
import type { HelpwaveIdTranslationEntries } from '../../i18n/translations'

type RealmBannerProps = {
    kcContext: { realm: Record<string, unknown> },
}

function extractRealmName(realm: Record<string, unknown>): string {
    const r = realm as { name?: string, realm?: string }
    return r.realm ?? r.name ?? 'unknown'
}

const HEADLINE: Record<Exclude<RealmKind, 'customer'>, keyof HelpwaveIdTranslationEntries> = {
    team: 'realmBannerTeam',
    admin: 'realmBannerAdmin',
    other: 'realmBannerOther',
}

const SUBTITLE: Record<Exclude<RealmKind, 'customer'>, keyof HelpwaveIdTranslationEntries> = {
    team: 'realmBannerSubtitleTeam',
    admin: 'realmBannerSubtitleAdmin',
    other: 'realmBannerSubtitleOther',
}

function KindIcon({ kind, className }: { kind: Exclude<RealmKind, 'customer'>, className?: string }) {
    if (kind === 'admin') return <ShieldAlert className={className} aria-hidden="true" />
    if (kind === 'team') return <Users className={className} aria-hidden="true" />
    return <Tag className={className} aria-hidden="true" />
}

/**
 * Full-width, sticky-top banner shown on every non-customer realm. Combines:
 * - bold colored bar across the viewport
 * - large realm name + icon
 * - 4 px outline around the page edge (driven by `--realm-accent`)
 * - document title prefix so the realm is visible in the browser tab
 */
export function RealmBanner({ kcContext }: RealmBannerProps) {
    const t = useTranslation()
    const realmName = extractRealmName(kcContext.realm)
    const theme = getRealmTheme(realmName)

    useEffect(() => {
        if (theme.kind === 'customer') return
        const original = document.title
        const tag = theme.kind === 'admin' ? 'ADMIN'
            : theme.kind === 'team' ? 'TEAM'
            : realmName.toUpperCase()
        document.title = `[${tag}] ${original}`
        return () => { document.title = original }
    }, [theme.kind, realmName])

    if (theme.kind === 'customer') return null

    const accent = `var(--color-${theme.cssToken})`
    const stripes = theme.intensity === 'strong'
        ? `repeating-linear-gradient(135deg, ${accent} 0 18px, color-mix(in oklab, ${accent} 70%, black) 18px 36px)`
        : accent

    const headlineKey = HEADLINE[theme.kind]
    const subtitleKey = SUBTITLE[theme.kind]

    return (
        <>
            <style>{`
                :root { --realm-accent: ${accent}; }
                body { box-shadow: inset 0 4px 0 0 ${accent}; }
            `}</style>

            <div
                role="banner"
                aria-label={`${realmName} realm indicator`}
                className="sticky top-0 z-[1100] w-full"
                style={{
                    background: stripes,
                    color: '#fff',
                    textShadow: '0 1px 1px rgba(0,0,0,0.35)',
                }}
            >
                <div className="mx-auto flex items-center justify-center gap-3 px-4 py-2 max-w-screen-md sm:gap-2 sm:py-1.5">
                    <KindIcon kind={theme.kind} className="w-6 h-6 shrink-0 sm:w-5 sm:h-5" />
                    <div className="flex flex-col items-start leading-tight sm:leading-snug">
                        <span className="font-extrabold tracking-wide uppercase text-base sm:text-sm">
                            {t(headlineKey)} · {realmName}
                        </span>
                        <span className="text-xs opacity-90 sm:hidden">
                            {t(subtitleKey)}
                        </span>
                    </div>
                </div>
            </div>
        </>
    )
}
