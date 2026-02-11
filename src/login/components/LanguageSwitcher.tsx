import { useState } from 'react'
import { IconButton, LanguageDialog } from '@helpwave/hightide'
import { Languages } from 'lucide-react'

export function LanguageSwitcher() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <IconButton
                type="button"
                coloringStyle="tonal"
                onClick={() => setIsOpen(true)}
                tooltip="Change language"
                useTooltipAsLabel
            >
                <Languages size={20} />
            </IconButton>
            <LanguageDialog
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />
        </>
    )
}
