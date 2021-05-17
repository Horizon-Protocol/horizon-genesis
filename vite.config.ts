import path from "path";
import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh(), tsconfigPaths()],
  esbuild: {
    jsxInject: `import React from 'react'`,
  },
  resolve: {
    alias: [
      {
        find: "squarelink",
        replacement: path.resolve("node_modules/squarelink/dist/index.js"),
      },
    ],
  },
});
