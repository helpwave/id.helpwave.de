import { HelpwaveLogo } from '@helpwave/hightide'

export function Branding() {
    return (
        <div className="flex flex-col items-center mb-8 sm:mb-8">
            <HelpwaveLogo animate="loading" height={96} width={96} />
            <div className="font-space text-4xl -translate-y-6 font-bold">
                helpwave id
            </div>
        </div>
    )
}
