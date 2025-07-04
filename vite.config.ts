import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
// import { viteErrorLogger } from "../vitelogs/vite-error-logger.js"; // TODO: Fix path to your vite error logger

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    // viteErrorLogger({ projectName: 'climb-connect-toronto' }), // TODO: Uncomment when path is fixed
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
