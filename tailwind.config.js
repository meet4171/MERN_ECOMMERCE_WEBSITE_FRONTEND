/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      screens: {
        'xs': '420px',
        'xmd': '890px',
      },
      fontFamily: {
        'kaushan': ['Kaushan Script', 'cursive'],
        'Comfortaa': ['Comfortaa', 'cursive']
      },

    },
  },
  plugins: [require('@tailwindcss/aspect-ratio'), require('@tailwindcss/forms')],
};
