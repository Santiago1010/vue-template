import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { quasar, transformAssetUrls } from "@quasar/vite-plugin";

export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls },
    }),

    quasar({
      sassVariables: fileURLToPath(
        new URL(
          "./src/assets/styles/quasar/quasar-variables.sass",
          import.meta.url,
        ),
      ),
    }),
  ],
});
