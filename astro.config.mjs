// astro.config.mjs
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import vercel from "@astrojs/vercel/serverless"; // use serverless (Resend SDK isn’t Edge)

export default defineConfig({
  output: "server",          // required for /api routes
  adapter: vercel(),         // deploys as Vercel Functions
  vite: { plugins: [tailwindcss()] }, // Tailwind v4 (you’re already using @theme + @import "tailwindcss";
});
