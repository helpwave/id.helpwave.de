import type { ChipColor } from '@helpwave/hightide'

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

export function getRealmColor(realmName: string): ChipColor {
    const normalizedName = realmName.toLowerCase()

    if (normalizedName === 'customer') {
        return 'neutral'
    }
    if (normalizedName === 'team') {
        return 'primary'
    }
    if (normalizedName === 'master') {
        return 'negative'
    }

    const hash = hashString(realmName)
    const index = hash % chipColors.length
    return chipColors[index]
}