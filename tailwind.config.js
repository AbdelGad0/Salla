/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/views/**/*.twig",
    "./src/assets/js/**/*.js",
    "./index.html"
  ],
  theme: {
    extend: {
      colors: {
        salla: {
          50: "#eefbf3",
          100: "#d7f5e1",
          500: "#1fbf75",
          600: "#16a765",
          700: "#12854f"
        }
      },
      fontFamily: {
        sans: ["Tajawal", "Cairo", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};
