import { HelpwaveLogo } from '@helpwave/hightide'

export function Branding() {
    return (
        <div className="flex flex-col items-center gap-4 mb-8 sm:gap-3 sm:mb-4">
            <HelpwaveLogo height={64} width={64} />
            <div className="font-space text-2xl font-bold tracking-[-0.5px] sm:text-xl">
                helpwave id
            </div>
        </div>
    )
}
