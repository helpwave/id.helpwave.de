import { useEffect, useState } from 'react'
import { HelpwaveLogo } from '@helpwave/hightide'

type BrandingProps = {
    animate?: 'none' | 'loading',
}

const ANIMATION_START_DELAY_MS = 3000

export function Branding({ animate = 'loading' }: BrandingProps) {
    const [effectiveAnimate, setEffectiveAnimate] = useState<'none' | 'loading'>(
        animate === 'loading' ? 'none' : animate
    )

    useEffect(() => {
        if (animate !== 'loading') {
            setEffectiveAnimate(animate)
            return
        }
        setEffectiveAnimate('none')
        const timeout = window.setTimeout(() => setEffectiveAnimate('loading'), ANIMATION_START_DELAY_MS)
        return () => window.clearTimeout(timeout)
    }, [animate])

    return (
        <div className="flex flex-col items-center">
            <HelpwaveLogo animate={effectiveAnimate} height={96} width={96} animationDuration={5} />
            <div className="font-space text-4xl -translate-y-8 font-[900]">
                helpwave id
            </div>
        </div>
    )
}
