/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* ALE canonical teal (mockup consistency report) */
        primary: '#006C6A',
        'primary-light': '#008080',
        'primary-dark': '#004C4C',
        /* Sidebar: light grey + teal active */
        'ale-sidebar': '#F0F0F0',
        'ale-sidebar-active': '#E6F0F0',
        secondary: '#f59e0b',
        'neutral-50': '#f9fafb',
        'neutral-100': '#f3f4f6',
        'neutral-200': '#e5e7eb',
        'neutral-300': '#d1d5db',
        'neutral-400': '#9ca3af',
        'neutral-500': '#6b7280',
        'neutral-600': '#4b5563',
        'neutral-700': '#374151',
        'neutral-800': '#1f2937',
        'neutral-900': '#111827',
        error: '#dc2626',
        success: '#16a34a',
        warning: '#f59e0b',
        info: '#3b82f6',
      },
    },
  },
  plugins: [],
}
