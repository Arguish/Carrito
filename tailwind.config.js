/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./pages/**/*.{js,jsx}",
        "./components/**/*.{js,jsx}",
        "./app/**/*.{js,jsx}",
    ],
    theme: {
        extend: {
            colors: {
                "magic-black": "#0E0B16",
                "magic-purple": "#4E4E50",
                "magic-blue": "#2E9CCA",
                "magic-gold": "#FFBC42",
            },
        },
    },
    plugins: [],
};
