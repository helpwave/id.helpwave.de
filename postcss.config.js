import autoprefixer from 'autoprefixer'

// Tailwind itself is processed by the @tailwindcss/vite plugin (see vite.config.ts).
// This PostCSS pass adds vendor prefixes to the generated CSS based on the
// `browserslist` config in package.json.
export default {
    plugins: [
        autoprefixer(),
    ],
}
