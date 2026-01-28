import { useState } from 'react'
import { Button, LanguageDialog } from '@helpwave/hightide'
import type { KcContext } from '../KcContext'
import { Languages } from 'lucide-react'

type LanguageSwitcherProps = {
    kcContext: KcContext,
}

export function LanguageSwitcher({ kcContext }: LanguageSwitcherProps) {
    const [isOpen, setIsOpen] = useState(false)

    const handleLanguageChange = (locale: string) => {
        const url = new URL(window.location.href)
        url.searchParams.set('kc_locale', locale)
        window.location.href = url.toString()
    }

    return (
        <>
            <Button
                type="button"
                color="secondary"
                onClick={() => setIsOpen(true)}
                style={{ padding: '0.5rem', minWidth: 'auto' }}
                aria-label="Change language"
            >
                <Languages size={20} />
            </Button>
            <LanguageDialog
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            >
                {kcContext.locale?.supported?.map((lang: { languageTag: string, label: string, url: string }) => (
                    <Button
                        key={lang.languageTag}
                        type="button"
                        color={kcContext.locale?.currentLanguageTag === lang.languageTag ? 'primary' : 'secondary'}
                        onClick={() => {
                            handleLanguageChange(lang.languageTag)
                            setIsOpen(false)
                        }}
                    >
                        {lang.label}
                    </Button>
                ))}
            </LanguageDialog>
        </>
    )
}