// const { build } = require("esbuild");
// const { dependencies } = require("./package.json");

import { build } from 'esbuild';
import { esbuildDecorators } from '@anatine/esbuild-decorators';
// const define = {};

// for (const k in process.env) {
//   if (k.startsWith("NODE_ENV")) {
//     define[`process.env.${k}`] = JSON.stringify(process.env[k]);
//   }
// }

// const external = Object.entries(dependencies).map(([key]) => key);

const sharedConfig = {
  bundle: true,
  entryPoints: ['src/index.ts'],
  // platform: "node",
  outbase: 'src',
  // define,
  tsconfig: './tsconfig.json',
  sourcemap: process.env.NODE_ENV === 'production',
  watch: process.env.NODE_ENV === 'development',
  // external: [...external, "esbuild", "rollup", "vite"],
  plugins: [
    esbuildDecorators({
      tsconfig: './tsconfig.json',
      cwd: process.cwd(),
    }),
  ],
};

console.log(process.env.NODE_ENV);

async function buildCommon(tsconfig, cwd) {
  return build({
    ...sharedConfig,
    format: 'cjs',
    outfile: 'dist/index.cjs.js',
  });
}

async function buildEsm(tsconfig, cwd) {
  return build({
    ...sharedConfig,
    format: 'esm',
    outfile: 'dist/index.es.js',
  });
}

async function buildBundle() {
  await buildCommon();
  await buildEsm();
}

buildBundle();
