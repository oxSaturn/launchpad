const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      fontFamily: {
        plexSans: ["IBM Plex Sans", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: "#14dbb8",
        secondary: "#36a186",
        accent: "#ffda58",
        neutral: "#222222",
        extendedBlack: "#111",
        success: "#07bc0c",
        warning: "#ffda58",
        error: "#ff4141",
        pulse: {
          cyan: "#00eaff",
          blue: "#0080ff",
          purple: "#8000ff",
          pink: "#e619e6",
          red: "#f00",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(ellipse, var(--tw-gradient-stops))",
      },
      keyframes: {
        hide: {
          from: { opacity: 1 },
          to: { opacity: 0 },
        },
        slideIn: {
          from: {
            transform: "translateX(calc(100% + var(--viewport-padding)))",
          },
          to: { transform: "translateX(0)" },
        },
        swipeOut: {
          from: { transform: "translateX(var(--radix-toast-swipe-end-x))" },
          to: { transform: "translateX(calc(100% + var(--viewport-padding)))" },
        },
      },
      animation: {
        hide: "hide 100ms ease-in",
        slideIn: "slideIn 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        swipeOut: "swipeOut 100ms ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-radix")()],
};
