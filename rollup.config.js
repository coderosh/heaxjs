import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";
import { defineConfig } from "rollup";
import dts from "rollup-plugin-dts";

export default defineConfig([
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/index.umd.js",
        format: "umd",
        name: "HeaxVerlet",
      },
      { file: "dist/index.js", format: "es" },
    ],
    plugins: [nodeResolve(), typescript(), terser()],
  },
  {
    input: "src/index.ts",
    output: [{ file: "dist/index.d.ts", format: "es" }],
    plugins: [dts()],
  },
]);
