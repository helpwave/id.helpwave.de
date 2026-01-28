import { useState } from 'react'
import { Button, ThemeDialog } from '@helpwave/hightide'
import { Palette } from 'lucide-react'

export function ThemeSwitcher() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <Button
                type="button"
                color="neutral"
                onClick={() => setIsOpen(true)}
                style={{ padding: '0.5rem', minWidth: 'auto' }}
                aria-label="Change theme"
            >
                <Palette size={20} />
            </Button>
            <ThemeDialog isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    )
}