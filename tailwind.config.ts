import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    'bg-green-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-gray-400',
    'animate-pulse',
    'rounded-full',
    'w-3',
    'h-3',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
export default config;
