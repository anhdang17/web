import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: { '2xl': '1400px' },
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
        popover: { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--popover-foreground))' },
        brand: {
          red:    '#E60012',
          black:  '#1A1A1A',
          gray:   '#767676',
          light:  '#F5F5F5',
          cream:  '#FAF9F6',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        xl: 'calc(var(--radius) + 4px)',
      },
      boxShadow: {
        'card':   '0 2px 8px hsl(var(--foreground) / 0.06), 0 1px 2px hsl(var(--foreground) / 0.04)',
        'card-hover': '0 8px 24px hsl(var(--foreground) / 0.12), 0 2px 6px hsl(var(--foreground) / 0.06)',
        'btn':    '0 1px 3px hsl(var(--foreground) / 0.1)',
        'btn-hover': '0 4px 12px hsl(var(--foreground) / 0.15)',
        'dropdown': '0 8px 24px hsl(var(--foreground) / 0.10), 0 1px 3px hsl(var(--foreground) / 0.05)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to:   { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to:   { height: '0' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        'slide-down': {
          from: { opacity: '0', transform: 'translateY(-8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
        'ken-burns': {
          '0%':   { transform: 'scale(1) translate(0, 0)' },
          '50%':  { transform: 'scale(1.06) translate(-1%, -1%)' },
          '100%': { transform: 'scale(1) translate(0, 0)' },
        },
        'progress-fill': {
          from: { width: '0%' },
          to:   { width: '100%' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up':   'accordion-up 0.2s ease-out',
        'fade-up':        'fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in':       'fade-in 0.4s ease-out both',
        'slide-down':     'slide-down 0.3s cubic-bezier(0.16, 1, 0.3, 1) both',
        'scale-in':       'scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) both',
        'ken-burns':      'ken-burns 6s ease-in-out infinite',
        'progress-fill':  'progress-fill 5s linear forwards',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
