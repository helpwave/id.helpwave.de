import { useState } from 'react'
import { IconButton, ThemeDialog } from '@helpwave/hightide'
import { Palette } from 'lucide-react'

export function ThemeSwitcher() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <IconButton
                type="button"
                coloringStyle="tonal"
                onClick={() => setIsOpen(true)}
                tooltip="Change theme"
                useTooltipAsLabel
            >
                <Palette size={20} />
            </IconButton>
            <ThemeDialog isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    )
}