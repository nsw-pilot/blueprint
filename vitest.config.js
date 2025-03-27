import {defineConfig} from 'vitest/config';
import {resolve} from "path";

export default defineConfig({
  test: {
    environment: 'jsdom', // Ensures DOM APIs are available
  },
  resolve: {
    alias: {
      Blocks: resolve(__dirname, 'src/blocks'),
      Styles: resolve(__dirname, 'src/styles'),
    },
  },
});
