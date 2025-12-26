import path from "node:path";

import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

// Docs: https://rsbuild.rs/config/
export default defineConfig({
  html: {
    meta: {
      description:
        "SAH-in Aja! Platform persiapan sertifikasi halal berbasis AI untuk UMKM Indonesia. Cek jalur sertifikasi, pelatihan kesadaran halal, analisis kesiapan dapur & bahan, buat dokumen wajib, konsultasi asisten halal, dan simulasi audit.",
      viewport: "width=device-width, initial-scale=1, viewport-fit=cover",
    },
    favicon: "public/favicon.avif",
    title: "SAH-in Aja! - Siap Audit Halal",
  },

  output: {
    assetPrefix: "/",
  },

  performance: {
    removeConsole: true,
  },

  plugins: [pluginReact()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@app": path.resolve(__dirname, "src/app"),
      "@features": path.resolve(__dirname, "src/features"),
      "@pages": path.resolve(__dirname, "src/pages"),
      "@shared": path.resolve(__dirname, "src/shared"),
    },
  },

  server: {
    host: "localhost",
    port: 3000,
  },

  source: {
    entry: {
      index: "./src/main.tsx",
    },
  },
});
