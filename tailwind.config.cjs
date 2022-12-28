/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        enter: 'enter 200ms ease-out',
        leave: 'leave 200ms ease-in',
      },
      keyframes: {
        enter: {
          '0%': { transform: 'scale(0.9) translateY(5%)', opacity: 0 },
          '100%': { transform: 'scale(1) translateY(0%)', opacity: 1 },
        },
        leave: {
          '0%': { transform: 'scale(1) translate(0%)', opacity: 1 },
          '100%': { transform: 'scale(0.9) translate(5%)', opacity: 0 },
        },
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["cupcake", "dark"],
  },
}
