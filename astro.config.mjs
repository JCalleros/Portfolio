import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import vercel from "@astrojs/vercel";
import node from "@astrojs/node";

const useNodePreview = !!process.env.ASTRO_PREVIEW;

export default defineConfig({
  output: "server",
  adapter: useNodePreview ? node({ mode: "standalone" }) : vercel(),
  vite: { plugins: [tailwindcss()] },
});
