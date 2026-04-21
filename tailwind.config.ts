import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0B1E3F",
          50: "#F3F5F9",
          100: "#E4E9F2",
          900: "#0B1E3F",
        },
        carbon: {
          DEFAULT: "#1A1A1A",
          muted: "#5B6470",
        },
        gold: {
          DEFAULT: "#B8925A",
          soft: "#D7B98A",
        },
        hairline: "#E6E8EC",
      },
      fontFamily: {
        sans: ["var(--font-plex-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-plex-serif)", "Georgia", "serif"],
      },
      fontSize: {
        display: ["clamp(3rem, 6vw, 5.5rem)", { lineHeight: "1.02", letterSpacing: "-0.02em" }],
        hero: ["clamp(2.25rem, 4vw, 3.5rem)", { lineHeight: "1.08", letterSpacing: "-0.015em" }],
      },
      letterSpacing: {
        micro: "0.14em",
      },
      boxShadow: {
        elev: "0 1px 2px rgba(11,30,63,0.04), 0 12px 32px -12px rgba(11,30,63,0.12)",
        hover: "0 1px 2px rgba(11,30,63,0.06), 0 24px 48px -16px rgba(11,30,63,0.18)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
