import { HelpwaveBadge } from '@helpwave/hightide'
import type { KcContext } from '../KcContext'

type RealmChipProps = {
    kcContext: KcContext,
};

export function RealmChip(_props: RealmChipProps) {
    return (
        <HelpwaveBadge size="lg" title="helpwave id" />
    )
}