import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  // the build is served from wherever it's unpacked (rosie, nginx, a plain folder)
  base: "./",
  test: { environment: "node" },
  // one page, one bundle: 2017's was 1 MB
  build: { chunkSizeWarningLimit: 1000 },
});
