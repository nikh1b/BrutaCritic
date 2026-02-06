/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#09090B', // Obsidian Black
                surface: '#18181B', // Carbon Gray
                'bruta-red': '#EF4444', // Accent Primary
                'critic-green': '#BEF264', // Accent Secondary (Cyber Lime)
                'text-primary': '#FAFAFA', // Alabaster
                'text-muted': '#A1A1AA', // Ash
            },
            fontFamily: {
                display: ['"Inter Display"', 'sans-serif'],
                body: ['Roboto', 'sans-serif'],
                mono: ['"Geist Mono"', 'monospace'],
            },
            animation: {
                'shake': 'shake 0.82s cubic-bezier(.36,.07,.19,.97) both',
            },
            keyframes: {
                shake: {
                    '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
                    '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
                    '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
                    '40%, 60%': { transform: 'translate3d(4px, 0, 0)' },
                },
            },
        },
    },
    plugins: [],
}
