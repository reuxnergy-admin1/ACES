import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

export default {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      zIndex: {
        bg: '0',
        content: '10',
        header: '90',
        overlay: '100',
      },
      maxWidth: {
        container: '80rem',
        'container-wide': '96rem',
        reading: '72ch',
      },
      spacing: {
        // universal ramp
        2: '0.5rem',
        3: '0.75rem',
        4: '1rem',
        6: '1.5rem',
        8: '2rem',
        12: '3rem',
        16: '4rem',
      },
    },
  },
  plugins: [typography()],
} satisfies Config
