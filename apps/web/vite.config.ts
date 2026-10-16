import { defineConfig } from "vite";
import vinext from "vinext";
import { cloudflare } from "@cloudflare/vite-plugin";
import { imagesOptimizer } from "@vinext/cloudflare/images/images-optimizer";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    vinext({
      images: { optimizer: imagesOptimizer() },
    }),
    cloudflare({
      viteEnvironment: {
        name: "rsc",
        childEnvironments: ["ssr"],
      },
    }),
  ],
  server: {
    port: 3000,
    strictPort: true,
  },
  resolve: {
    alias: [
      {
        replacement: path.resolve(__dirname, "src/components"),
        find: "@/components",
      },
      {
        replacement: path.resolve(__dirname, "src/lib"),
        find: "@/lib",
      },
      {
        replacement: path.resolve(__dirname, "src"),
        find: "@",
      },
    ],
  },
});
