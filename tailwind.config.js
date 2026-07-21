/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        'dark': {
          '50': '#2A2A3A',
          '100': '#232332',
          '200': '#1C1C28',
          '300': '#181822',
          '400': '#14141E',
          '500': '#101018',
          '600': '#0D0D14',
          '700': '#0A0A10',
          '800': '#08080C',
          '900': '#06060A',
          '950': '#040406',
          DEFAULT: 'var(--color-dark)',
        },
        'primary': {
          '50': '#faf7f2',
          '100': '#f3ebd9',
          '200': '#e6d3af',
          '300': '#d5b580',
          '400': '#c59a58',
          '500': '#b88143',
          '600': '#a76a38',
          '700': '#8b5331',
          '800': '#72432d',
          '900': '#5d3727',
          DEFAULT: 'var(--color-primary)',
        },
        'secondary': {
          '50': '#fffcf2',
          '100': '#fff7e0',
          '200': '#ffecba',
          '300': '#ffde8a',
          '400': '#ffc140',
          '500': '#f5a616',
          '600': '#da830a',
          '700': '#b55e0d',
          '800': '#944911',
          '900': '#793c11',
          DEFAULT: 'var(--color-secondary)',
        },
      },
      fontFamily: {
        'heading': ['Space Grotesk', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'float-slower': 'float 10s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'gradient': 'gradient 8s ease infinite',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'slide-down': 'slideDown 0.3s ease-out forwards',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'scale-in': 'scaleIn 0.4s ease-out forwards',
        'particle': 'particle 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(212, 175, 55, 0.2), 0 0 20px rgba(212, 175, 55, 0.1)' },
          '100%': { boxShadow: '0 0 20px rgba(212, 175, 55, 0.4), 0 0 60px rgba(212, 175, 55, 0.2)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        particle: {
          '0%': { transform: 'translateY(100vh) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateY(-100vh) rotate(720deg)', opacity: '0' },
        },
      },
      backgroundSize: {
        '300%': '300%',
      },
    },
  },
  plugins: [],
}
