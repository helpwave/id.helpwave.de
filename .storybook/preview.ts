import type { Preview } from '@storybook/react-vite'
import '@helpwave/hightide/style/globals.css'

if (typeof window !== 'undefined' && typeof process === 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).process = { env: {} }
}

const hideLanguageSwitcherCss = `
    .kc-locale,
    [id*="kc-locale"],
    [class*="kc-locale"],
    [id*="locale"],
    [class*="locale"],
    .pf-c-select,
    select[id*="locale"],
    select[name*="locale"],
    form[action*="locale"],
    .kc-dropdown,
    [class*="kc-dropdown"] {
        display: none !important;
    }
`

const preview: Preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i
            }
        }
    },
    decorators: [
        (Story) => {
            if (typeof document !== 'undefined') {
                const styleId = 'hide-language-switcher'
                if (!document.getElementById(styleId)) {
                    const style = document.createElement('style')
                    style.id = styleId
                    style.textContent = hideLanguageSwitcherCss
                    document.head.appendChild(style)
                }
            }
            return Story()
        }
    ]
}

export default preview
