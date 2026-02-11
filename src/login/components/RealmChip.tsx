import { Chip } from '@helpwave/hightide'
import { getRealmColor } from '../utils/realmColor'

type RealmChipProps = {
    kcContext: { realm: { name?: string, realm?: string } },
};

export function RealmChip({ kcContext }: RealmChipProps) {
    const realmName = (kcContext.realm as { name?: string, realm?: string })?.realm ??
        (kcContext.realm as { name?: string })?.name ??
        'unknown'
    const color = getRealmColor(realmName)

    return realmName === 'main' ? <></> : (
        <Chip color={color} size="md" aria-label={`realm: ${realmName}`}>
            {realmName}
        </Chip>
    )
}
