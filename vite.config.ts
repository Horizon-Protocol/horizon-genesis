import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import vitePluginImp from "vite-plugin-imp";
import tsconfigPaths from "vite-tsconfig-paths";
import svgrPlugin from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "0.0.0.0",
  },
  esbuild: {},
  resolve: {
    alias: [
      {
        find: "@binance-chain/bsc-connector",
        replacement: path.resolve(
          "node_modules/@binance-chain/bsc-connector/dist/bsc-connector.esm.js"
        ),
      },
    ],
  },
  css: {
    postcss: {
      plugins: [require("postcss-nested"), require("postcss-nesting")],
    },
  },
  optimizeDeps: {
    include: ["@horizon-protocol/contracts-interface"],
  },
  build: {
    // sourcemap: true,
    chunkSizeWarningLimit: 15000,
    commonjsOptions: {
      exclude: ["contracts-interface/*"],
    },
  },
  plugins: [
    react(),
    tsconfigPaths(),
    svgrPlugin({
      svgrOptions: {
        icon: true,
        // ...svgr options (https://react-svgr.com/docs/options/)
      },
    }),
    vitePluginImp({
      libList: [
        {
          libName: "lodash",
          libDirectory: "",
          camel2DashComponentName: false,
          style: () => {
            return false;
          },
        },
        {
          libName: "@mui/material",
          libDirectory: "",
          camel2DashComponentName: false,
          style: () => {
            return false;
          },
        },
        {
          libName: "@mui/lab",
          libDirectory: "",
          camel2DashComponentName: false,
          style: () => {
            return false;
          },
        },
        {
          libName: "@mui/icons-material",
          libDirectory: "",
          camel2DashComponentName: false,
          style: () => {
            return false;
          },
        },
      ],
    }),
  ],
});
