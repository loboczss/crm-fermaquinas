import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/components/**/*.{js,vue,ts}',
    './app/layouts/**/*.vue',
    './app/pages/**/*.vue',
    './app/plugins/**/*.{js,ts}',
    './app/app.vue',
    './app/error.vue',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1E40AF', // azul
          light: '#3B82F6',
          dark: '#1E3A8A',
        },
        secondary: {
          DEFAULT: '#DC2626', // vermelho
          light: '#EF4444',
          dark: '#991B1B',
        },
        background: {
          DEFAULT: '#FFFFFF', // branco
          dark: '#000000', // preto
          gray: '#F3F4F6',
        },
        text: {
          DEFAULT: '#000000', // preto
          light: '#6B7280',
          white: '#FFFFFF',
        },
      },
      fontFamily: {
        // Adicione suas fontes personalizadas aqui
      },
    },
  },
  plugins: [],
} satisfies Config
