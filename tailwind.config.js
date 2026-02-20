/** @type {import('tailwindcss').Config} */
export default {
  // Enable class-based dark mode — toggled by adding `dark` to <html>
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        // xs = 475px: used to hide the avatar on very small phones (320-474px)
        // and show it once there's enough room
        xs: "475px",
      },
      // Custom animation delays for the typing indicator dots
      animationDelay: {
        "150": "150ms",
        "300": "300ms",
      },
    },
  },
  plugins: [],
};

