// const { build } = require("esbuild");
// const { dependencies } = require("./package.json");

import { build } from 'esbuild';
import alias from 'esbuild-plugin-alias';
import path from 'path';

// const define = {};

// for (const k in process.env) {
//   if (k.startsWith("NODE_ENV")) {
//     define[`process.env.${k}`] = JSON.stringify(process.env[k]);
//   }
// }

// const external = Object.entries(dependencies).map(([key]) => key);

const sharedConfig = {
  alias: '',
  bundle: true,
  entryPoints: ['src/index.ts'],
  // platform: "node",
  outbase: 'src',
  // define,
  tsconfig: './tsconfig.json',
  sourcemap: process.env.NODE_ENV === 'production',
  watch: process.env.NODE_ENV === 'development',
  // external: [...external, "esbuild", "rollup", "vite"],
};

console.log(process.env.NODE_ENV);

async function buildCommon() {
  return build({
    ...sharedConfig,
    format: 'cjs',
    outfile: 'dist/index.cjs.js',
    plugins: [
      alias({
        '@workspace/extension-common': path.resolve(
          '../extension-common/src/index.ts',
        ),
      }),
    ],
  });
}

async function buildEsm() {
  return build({
    ...sharedConfig,
    format: 'esm',
    outfile: 'dist/index.es.js',
    plugins: [
      alias({
        '@workspace/extension-common': path.resolve(
          '../extension-common/src/index.ts',
        ),
      }),
    ],
  });
}

async function buildBundle() {
  await buildCommon();
  await buildEsm();
}

buildBundle();
