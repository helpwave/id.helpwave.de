import type { ChipColor } from '@helpwave/hightide'

export type RealmKind = 'customer' | 'team' | 'admin' | 'other'

export type RealmTheme = {
    color: ChipColor,
    cssToken: 'primary' | 'secondary' | 'warning' | 'negative' | 'positive' | 'neutral',
    intensity: 'none' | 'subtle' | 'strong',
    kind: RealmKind,
}

const chipColors: ChipColor[] = [
    'primary',
    'neutral',
    'positive',
    'warning',
    'negative'
]

function hashString(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i)
        hash = (hash << 5) - hash + char
        hash = hash & hash
    }
    return Math.abs(hash)
}

const adminRealmNames = new Set(['master', 'admin', 'administrator', 'admins'])
const customerRealmNames = new Set(['customer', 'main'])

export function getRealmKind(realmName: string): RealmKind {
    const n = realmName.toLowerCase()
    if (customerRealmNames.has(n)) return 'customer'
    if (n === 'team') return 'team'
    if (adminRealmNames.has(n)) return 'admin'
    return 'other'
}

export function getRealmTheme(realmName: string): RealmTheme {
    const kind = getRealmKind(realmName)
    switch (kind) {
        case 'customer':
            return { color: 'primary', cssToken: 'primary', intensity: 'none', kind }
        case 'team':
            return { color: 'secondary', cssToken: 'secondary', intensity: 'subtle', kind }
        case 'admin':
            return { color: 'negative', cssToken: 'negative', intensity: 'strong', kind }
        default: {
            const idx = hashString(realmName) % chipColors.length
            const color = chipColors[idx]
            const tokenMap: Record<ChipColor, RealmTheme['cssToken']> = {
                primary: 'primary',
                secondary: 'secondary',
                neutral: 'neutral',
                positive: 'positive',
                warning: 'warning',
                negative: 'negative',
            }
            return { color, cssToken: tokenMap[color] ?? 'warning', intensity: 'subtle', kind }
        }
    }
}

/** @deprecated Prefer {@link getRealmTheme}. */
export function getRealmColor(realmName: string): ChipColor {
    return getRealmTheme(realmName).color
}
