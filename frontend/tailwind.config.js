/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        risk: {
          low: "#10B981",       // Green
          moderate: "#F59E0B",  // Yellow
          high: "#F97316",      // Orange
          veryhigh: "#EF4444"   // Red
        }
      }
    },
  },
  plugins: [],
}
