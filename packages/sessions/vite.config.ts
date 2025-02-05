// vite.config.js
import { resolve as resolvePath } from "path"

import dts from "vite-plugin-dts"
import { defineConfig } from "vitest/config"

export default defineConfig({
  build: {
    rollupOptions: {
      external: ["starknet", "@argent/shared"],
      output: {
        exports: "named",
      },
    },
    emptyOutDir: false,
    lib: {
      entry: resolvePath(__dirname, "src/main.ts"),
      name: "sessions",
      // the proper extensions will be added
      fileName: "sessions",
    },
  },
  optimizeDeps: {
    include: ["starknet"],
  },
  plugins: [
    dts({
      entryRoot: resolvePath(__dirname, "src"),
      insertTypesEntry: true,
    }),
  ],
  test: {
    deps: {
      optimizer: {
        web: {
          enabled: false,
        },
      },
    },
    environment: "happy-dom",
    exclude: ["**/node_modules/**", "**/*.mock.ts"],
    coverage: {
      exclude: [
        "**/*.mock.ts",
        "**/setup.ts",
        "**/*.json",
        "**/*.config.{js,ts}",
        "test{,s}/**",
        "spec{,s}/**",
        "test{,-*}.{js,cjs,mjs,ts,tsx,jsx}",
        "spec{,-*}.{js,cjs,mjs,ts,tsx,jsx}",
        "**/*.d.ts",
      ],
      reportsDirectory: "./coverage",
      excludeNodeModules: true,
      reporter: ["text", "lcov"],
      all: true,
    },
  },
  esbuild: {
    pure: process.env.NODE_ENV === "production" ? ["console.log"] : [],
  },
})
