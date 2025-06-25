const path = require("path");
const esbuild = require("esbuild");

esbuild
  .build({
    entryPoints: ["src/**/*.ts"],
    outdir: "dist",
    bundle: true,
    minify: process.env.NODE_ENV === "production",
    platform: "node",
    target: "node20",
    sourcemap: false,
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  })
  .catch(() => process.exit(1));
