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
                "magic-black": "#0d0d0d",
                "magic-dark": "#1a1a1a",
                "magic-gray": "#2d2d2d",
                "magic-light-gray": "#404040",
                "magic-orange": "#e95420",
                "magic-gold": "#d4a254",
                "magic-white": "#f5f5f5",
            },
            fontFamily: {
                sans: [
                    "system-ui",
                    "-apple-system",
                    "BlinkMacSystemFont",
                    '"Segoe UI"',
                    "Roboto",
                    "sans-serif",
                ],
            },
        },
    },
    plugins: [],
};
