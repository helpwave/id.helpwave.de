import { HelpwaveLogo } from '@helpwave/hightide'

export function Branding() {
    return (
        <div className="flex flex-col items-center gap-4 mb-8 sm:gap-3 sm:mb-6">
            <HelpwaveLogo height={64} width={64} />
            <div className="font-['Space_Grotesk',_'Helvetica_Neue',_Helvetica,_sans-serif] text-2xl font-bold text-black tracking-[-0.5px] sm:text-xl">
                helpwave id
            </div>
        </div>
    )
}