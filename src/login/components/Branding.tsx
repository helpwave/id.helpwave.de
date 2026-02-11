import { HelpwaveLogo } from '@helpwave/hightide'

type BrandingProps = {
    animate?: 'none' | 'loading',
}

export function Branding({ animate = 'loading' }: BrandingProps) {
    return (
        <div className="flex flex-col items-center">
            <HelpwaveLogo animate={animate} height={96} width={96} animationDuration={5} />
            <div className="font-space text-4xl -translate-y-8 font-[900]">
                helpwave id
            </div>
        </div>
    )
}
