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
  resolve: {
    alias: [
      {
        replacement: path.resolve(__dirname, "components"),
        find: "@/components",
      },
      {
        replacement: path.resolve(__dirname, "lib"),
        find: "@/lib",
      },
      {
        replacement: path.resolve(__dirname, "src"),
        find: "@",
      },
    ],
  },
});
