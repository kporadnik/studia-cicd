const path = require("path");
const glob = require("glob");
const esbuild = require("esbuild");

const entryPoints = glob.sync("src/**/*.ts", {
  ignore: ["**/__tests__/**", "**/*.test.ts"],
});

esbuild
  .build({
    entryPoints,
    outdir: "dist",
    bundle: true,
    minify: true,
    platform: "node",
    target: "node20",
    sourcemap: false,
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  })
  .catch(() => process.exit(1));
