import { useState } from 'react'
import { Button, LanguageDialog } from '@helpwave/hightide'
import { Languages } from 'lucide-react'

export function LanguageSwitcher() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <Button
                type="button"
                color="neutral"
                onClick={() => setIsOpen(true)}
                style={{ padding: '0.5rem', minWidth: 'auto' }}
                aria-label="Change language"
            >
                <Languages size={20} />
            </Button>
            <LanguageDialog
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />
        </>
    )
}
