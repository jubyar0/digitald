// Tailwind CSS v4 uses CSS-first configuration
// All theme configuration is now in app/styles/theme.css using @theme directive
// This file is kept minimal for compatibility with build tools

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
    "../../packages/sera/src/**/*.{ts,tsx}",
  ],
}