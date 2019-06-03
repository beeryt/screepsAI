"use strict";

import clear from "rollup-plugin-clear";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import typescript from "rollup-plugin-typescript2";
import screeps from "rollup-plugin-screeps";

let cfg;
const dest = process.env.DEST;
if (dest && (cfg = require("./screeps.json")[dest]) == null) {
  throw new Error("Invalid upload destination");
}

console.log("Compiling...");
if (dest) console.log(`Deploying ${dest}...`);

export default {
  input: "src/main.ts",
  output: {
    file: "./build/dist/main.js",
    format: "cjs",
    sourcemap: true
  },

  plugins: [
    clear({ targets: ["dist"] }),
    resolve(),
    commonjs(),
    terser({sourcemap: true}),
    typescript({
      tsconfig: "./tsconfig.json",
      tsconfigOverride: {
        compilerOptions: { module: "ESNext" }
      },
    }),
    screeps({config: cfg, dryRun: cfg == null})
  ]
};
