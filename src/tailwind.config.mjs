/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}', './public/**/*.html'],
    theme: {
        extend: {
            fontSize: {
                xs: ['0.75rem', { lineHeight: '1', letterSpacing: '0.05em', fontWeight: '300' }],
                sm: ['0.875rem', { lineHeight: '1.25', letterSpacing: '0.025em', fontWeight: '300' }],
                base: ['1rem', { lineHeight: '1.5', letterSpacing: '0.01em', fontWeight: '300' }],
                lg: ['1.125rem', { lineHeight: '1.75', letterSpacing: '0.01em', fontWeight: '300' }],
                xl: ['1.25rem', { lineHeight: '1.75', letterSpacing: '0.01em', fontWeight: '300' }],
                '2xl': ['1.5rem', { lineHeight: '2', letterSpacing: '0.01em', fontWeight: '400' }],
                '3xl': ['1.875rem', { lineHeight: '2.25', letterSpacing: '0.01em', fontWeight: '400' }],
                '4xl': ['2.25rem', { lineHeight: '2.5', letterSpacing: '-0.01em', fontWeight: '400' }],
                '5xl': ['3rem', { lineHeight: '1', letterSpacing: '-0.02em', fontWeight: '700' }],
                '6xl': ['3.75rem', { lineHeight: '1', letterSpacing: '-0.02em', fontWeight: '700' }],
                '7xl': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.02em', fontWeight: '700' }],
                '8xl': ['6rem', { lineHeight: '1', letterSpacing: '-0.02em', fontWeight: '700' }],
                '9xl': ['8rem', { lineHeight: '1', letterSpacing: '-0.02em', fontWeight: '700' }],
            },
            fontFamily: {
                heading: "cormorantgaramond",
                paragraph: "sora-light"
            },
            colors: {
                'soft-white': '#F0F0F0',
                destructive: '#FF4500',
                'destructive-foreground': '#FFFFFF',
                background: '#121212',
                secondary: '#FFFFFF',
                foreground: '#FFFFFF',
                'secondary-foreground': '#121212',
                'primary-foreground': '#FFFFFF',
                primary: '#8B0000'
            },
        },
    },
    future: {
        hoverOnlyWhenSupported: true,
    },
    plugins: [require('@tailwindcss/container-queries'), require('@tailwindcss/typography')],
}
