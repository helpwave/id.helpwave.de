import { Chip } from '@helpwave/hightide'
import type { KcContext } from '../KcContext'
import { getRealmColor } from '../utils/realmColor'

type RealmChipProps = {
    kcContext: KcContext,
};

export function RealmChip({ kcContext }: RealmChipProps) {
    const realmName = (kcContext.realm as { name?: string, realm?: string })?.realm ??
                      (kcContext.realm as { name?: string })?.name ??
                      'unknown'
    const color = getRealmColor(realmName)

    return (
        <Chip color={color} size="md" aria-label={`realm: ${realmName}`}>
            {realmName}
        </Chip>
    )
}