import configs from '@helpwave/eslint-config'

export default [
    ...configs.recommended,
    {
        ignores: ['dist/**', 'dist_keycloak/**', 'storybook-static/**', 'node_modules/**', 'public/**', 'src/i18n/translations.ts']
    }
]