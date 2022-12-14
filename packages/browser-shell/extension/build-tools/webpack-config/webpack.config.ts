import webpack, { Configuration } from 'webpack';
import path, { relative, resolve } from 'path';
import { execSync } from 'child_process';

import FilemanagerPlugin from 'filemanager-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import WextManifestWebpackPlugin from 'wext-manifest-webpack-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';

import { ESBuildMinifyPlugin } from 'esbuild-loader';

// import Icons from "unplugin-icons/webpack";
// import { promises as fs } from "fs";
// // loader helpers
// import { FileSystemIconLoader } from "unplugin-icons/loaders";
// //const HtmlWebpackInlineSVGPlugin = require("html-webpack-inline-svg-plugin");
// import HtmlWebpackInlineSVGPlugin from "html-webpack-inline-svg-plugin";

import 'webpack-dev-server';

import {
  isDev,
  isProd,
  resRoot,
  resSrc,
  nodeEnv,
  targetBrowser,
  OUTDIR_WEBPACK_NAME,
  resRootPackages,
} from '../shared';
import { aliasWebpack, getAlias } from '../shared/sharedConfig';

// const packages = ['browser-shell', 'message-system'];

// const alias = {
//   '~icons/public-assets-icons': resSrc('../public/assets/icons/'),
//   '@browser-shell': resSrc(),
//   '@ui': resSrc('extension-ui/'),
//   '@utils': resSrc('utils/'),
// };

export const getExtensionFileType = (browser) => {
  if (browser === 'opera') return 'crx';
  if (browser === 'firefox') return 'xpi';
  return 'zip';
};

const config: Configuration = {
  devtool: false, // https://github.com/webpack/webpack/issues/1194#issuecomment-560382342
  // todo source-map
  stats: {
    all: false,
    builtAt: true,
    errors: true,
    hash: true,
  },

  mode: nodeEnv,

  devServer: {
    hot: true,
  },

  entry: {
    messages: { import: resRootPackages('extension-common/src', 'index.ts') },
    background: {
      import: resSrc('background', 'prod.ts'),
      // dependOn: "messages",
    },
    'contentScripts/cs.global': {
      import: resSrc('contentScripts', 'cs-scripts', 'main.ts'),
      dependOn: 'messages',
    },
    'contentScripts/cs.toolbar': {
      import: resSrc('contentScripts', 'cs-scripts', 'toolbar.ts'),
      dependOn: 'messages',
    },
    'contentScripts/cs.sidebar': {
      import: resSrc('contentScripts', 'cs-scripts', 'sidebar.ts'),
      dependOn: 'messages',
    },
    'popup/popup': { import: resSrc('popup', 'main.ts') },
    'options/options': { import: resSrc('options', 'main.ts') },
  },

  output: {
    path: resRoot(OUTDIR_WEBPACK_NAME, targetBrowser),
    filename: 'dist/[name].js',
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json', '.svg'],

    fallback: {
      crypto: require.resolve('crypto-browserify'),
      path: require.resolve('path-browserify'),
      stream: require.resolve('stream-browserify'),
    },

    alias: getAlias(aliasWebpack),
    //  packages.reduce(
    //   (alias, p) => ({
    //     ...alias,
    //     [`@workspace/${p}`]: path.resolve(__dirname, `../../../${p}/src`),
    //   }),
    //   alias
    // ),

    //    modules: [path.resolve(__dirname, '../../node_modules'), 'node_modules'],
    modules: [path.resolve(__dirname, '../../../node_modules'), 'node_modules'],
  },

  module: {
    rules: [
      {
        type: 'javascript/auto', // prevent webpack handling json with its own loaders,
        test: /manifest\.json$/,
        use: {
          loader: 'wext-manifest-loader',
          options: {
            usePackageJSONVersion: true, // set to false to not use package.json version for manifest
          },
        },
        exclude: /[\\/]node_modules[\\/]/, // /node_modules/,
      },

      {
        test: /\.ts(x?)$/,
        exclude: /[\\/]node_modules[\\/]/, // /node_modules/,
        loader: 'esbuild-loader',
        options: {
          loader: 'tsx', // Or 'ts' if you don't need tsx
          target: 'es2018',
          // tsconfigRaw: require("../../tsconfig.json"),
          jsxFactory: 'React.createElement',
          jsxFragment: 'React.Fragment',
        },
      },
      // {
      //   test: /\.css$/,
      //   use: [
      //     isProd && MiniCssExtractPlugin.loader,
      //     {
      //       loader: 'css-loader',
      //       options: {
      //         importLoaders: 1,
      //       },
      //     },
      //     {
      //       loader: 'esbuild-loader',
      //       options: {
      //         loader: 'css',
      //         minify: isProd,
      //       },
      //     },
      //     'postcss-loader',
      //   ].filter(Boolean),
      //   exclude: /\.module\.css$/,
      // },
      // {
      //   test: /\.css$/,
      //   use: [
      //     isProd && MiniCssExtractPlugin.loader,
      //     {
      //       loader: 'css-loader',
      //       options: {
      //         importLoaders: 1,
      //         modules: true,
      //       },
      //     },
      //     {
      //       loader: 'esbuild-loader',
      //       options: {
      //         loader: 'css',
      //         minify: isProd,
      //       },
      //     },
      //     'postcss-loader',
      //   ].filter(Boolean),
      //   include: /\.module\.css$/,
      // },
      // {
      //   test: /\.s[ac]ss$/i,
      //   use: [
      //     isProd && MiniCssExtractPlugin.loader,
      //     isDev && 'style-loader',
      //     'css-loader?sourceMap',
      //     {
      //       loader: 'sass-loader?sourceMap',
      //       options: {
      //         implementation: require('sass'),
      //         webpackImporter: false,
      //         sassOptions: {
      //             fiber: require('fibers'),
      //         },
      //         additionalData: "@use 'src/styles/styleUtils/variables' as *;",
      //       },
      //     },
      //     'postcss-loader',
      //   ].filter(Boolean),
      // },
      // {
      //   test: /\.less$/,
      //   use: [
      //     isProd && MiniCssExtractPlugin.loader,
      //     'css-loader',
      //     'less-loader',
      //   ].filter(Boolean),
      // },
      // {
      //   test: /\.(jpe?g|png|gif|svg|webp)$/i,
      //   type: 'asset/resource',
      //   generator: {
      //     filename: 'static/assets/images/[contenthash][ext][query]',
      //   },
      // },
      // {
      //   test: /\.svg/,
      //   type: 'asset/inline',
      // },
      // {
      //   test: /\.svg$/,
      //   use: ['@svgr/webpack']
      // },
      // {
      //   test: /\.(ogg|mp3|wav|mpe?g)$/i,
      //   use: 'file-loader'
      //   type: 'asset/resource',
      //   generator: {
      //     filename: 'static/assets/audio/[contenthash][ext][query]',
      //   },
      // },
      // {
      //   test: /favicon\.(png|ico)$/,
      //   type: 'asset/resource',
      // },
      // {
      //   test: /\.(woff|woff2|eot|ttf|otf)$/i,
      //   type: 'asset/resource',
      //   generator: {
      //     filename: 'static/assets/fonts/[contenthash][ext][query]',
      //   },
      // },
      // {
      //   test: /\.(mp4|webm)$/,
      //   type: 'asset/resource',
      //   generator: {
      //     filename: 'static/assets/video/[contenthash][ext][query]',
      //   },
      // },

      // {
      //   test: /\\.css$/,
      //   use: [
      //     "style-loader",
      //     {
      //       loader: "css-loader",
      //       options: {
      //         importLoaders: 1,
      //         modules: true,
      //       },
      //     },
      //   ],
      // },

      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader, // It creates a CSS file per JS file which contains CSS
          },
          {
            loader: 'css-loader', // Takes the CSS files and returns the CSS with imports and url(...) for Webpack
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  [
                    'autoprefixer',
                    {
                      // Options
                    },
                  ],
                ],
              },
            },
          },

          'resolve-url-loader', // Rewrites relative paths in url() statements
          'sass-loader', // Takes the Sass/SCSS file and compiles to the CSS
        ],
        exclude: /\.module\.css$/, // /////
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader, // It creates a CSS file per JS file which contains CSS
          },
          {
            loader: 'css-loader', // Takes the CSS files and returns the CSS with imports and url(...) for Webpack
            options: {
              sourceMap: true,
              importLoaders: 1,
              modules: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  [
                    'autoprefixer',
                    {
                      // Options
                    },
                  ],
                ],
              },
            },
          },

          'resolve-url-loader', // Rewrites relative paths in url() statements
          'sass-loader', // Takes the Sass/SCSS file and compiles to the CSS
        ],
        include: /\.module\.css$/, // /////
      },
      {
        test: /\.svg$/,
        loader: '@svgr/webpack',
        options: {
          svgoConfig: {
            plugins: [
              {
                name: 'removeViewBox',
                active: false,
              },
            ],
          },
        },
      },
      // {
      //   test: /\.svg$/,
      //   use: [
      //     "babel-loader",
      //     {
      //       loader: "react-svg-loader",
      //       options: {
      //         svgo: {
      //           plugins: [{ removeDimensions: true, removeViewBox: false }],
      //           floatPrecision: 2,
      //         },
      //       },
      //     },
      //   ],
      // },
      // {
      //   test: /\.svg$/,
      //   use: ["@svgr/webpack"],
      // },
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
      // {
      //   test: /\.svg$/,
      //   use: ["@svgr/webpack", "url-loader"],
      // },
      // {
      //   test: /\.svg$/,
      //   use: [
      //     {
      //       loader: "@svgr/webpack",
      //       options: {
      //         template: (
      //           { template },
      //           opts,
      //           { imports, componentName, props, jsx, exports }
      //         ) => template.ast`
      //           ${imports}
      //           import useWithViewbox from '../useWithViewbox';

      //           const ${componentName} = (${props}) => {
      //             const ref = React.useRef();

      //             useWithViewbox(ref);

      //             props = { ...props, ref };

      //             return ${jsx};
      //           };

      //           export default ${componentName};
      //         `,
      //       },
      //     },
      //   ],
      // },
      // {
      //   test: /\.svg$/i,
      //   issuer: /\.[jt]sx?$/,
      //   use: ["@svgr/webpack"],
      // },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf|)$/,
        type: 'asset/inline',
      },
      // {
      //   test: /\.svg$/,
      //   use: ["@svgr/webpack", "url-loader"],
      // },
      // {
      //   test: /\.(jpe?g|png|gif|webp)$/i,
      //   type: "asset/resource",
      //   // generator: {
      //   //   filename: "static/assets/images/[contenthash][ext][query]",
      //   // },
      // },
      // {
      //   test: /\.svg/,
      //   type: "asset/inline",
      // },
      // {
      //   test: /\.svg$/,
      //   use: ['@svgr/webpack']
      // },
      // {
      //   test: /\.(ogg|mp3|wav|mpe?g)$/i,
      //   // use: 'file-loader'
      //   type: 'asset/resource',
      //   generator: {
      //     filename: 'static/assets/audio/[contenthash][ext][query]'
      //   }
      // },
      {
        test: /favicon\.(png|ico)$/,
        type: 'asset/resource',
      },
    ],
  },

  plugins: [
    // Icons({
    //   compiler: "jsx",
    //   jsx: "react",
    //   customCollections: {
    //     // key as the collection name
    //     "my-icons": {
    //       account: "<svg><!-- ... --></svg>",
    //       // load your custom icon lazily
    //       settings: () => fs.readFile("./path/to/my-icon.svg", "utf-8"),
    //       /* ... */
    //     },
    //     "my-other-icons": async (iconName) => {
    //       // your custom loader here. Do whatever you want.
    //       // for example, fetch from a remote server:
    //       return await fetch(`https://example.com/icons/${iconName}.svg`).then(
    //         (res) => res.text()
    //       );
    //     },
    //     // a helper to load icons from the file system
    //     // files under `./assets/icons` with `.svg` extension will be loaded as it's file name
    //     // you can also provide a transform callback to change each icon (optional)
    //     "public-assets-icons": FileSystemIconLoader(
    //       resRoot("./public/assets/icons"),
    //       (svg) => svg.replace(/^<svg /, '<svg fill="currentColor" ')
    //     ),
    //   },
    // }),
    {
      apply: (compiler) => {
        let wroteManifest = false;

        compiler.hooks.afterEmit.tap('AfterEmitPlugin', (compilation) => {
          if (!wroteManifest) {
            execSync('npx esno ./build-tools/dev-scripts/manifest.ts', {
              stdio: 'inherit',
            });
          }
          wroteManifest = true;
        });
      },
    },
    // Plugin to not generate js bundle for manifest entry
    new WextManifestWebpackPlugin(),
    // Generate sourcemaps
    // /new webpack.SourceMapDevToolPlugin({ filename: false }),
    // / new ForkTsCheckerWebpackPlugin(),
    // environmental variables
    new webpack.EnvironmentPlugin({
      NODE_ENV: isDev, // "development",
      TARGET_BROWSER: targetBrowser, // "chrome",
      IS_WEBPACK: true,
      IS_VITE: false,
      IS_CRXJS: false,
    }),
    new webpack.DefinePlugin({
      __DEV__: isDev,
      __IS_WEBPACK__: true,
      __IS_VITE__: false,
      __IS_CRXJS__: false,
    }),
    // delete previous build files
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [
        resRoot(`extension/${targetBrowser}`),
        resRoot(
          `extension/${targetBrowser}.${getExtensionFileType(targetBrowser)}`,
        ),
      ],
      dry: false,
      dangerouslyAllowCleanPatternsOutsideProject: true,
      cleanStaleWebpackAssets: false,
      verbose: true,
    }),
    new HtmlWebpackPlugin({
      template: resSrc('popup', 'index.html'),
      inject: 'body', // true
      chunks: ['popup/popup'],
      filename: 'dist/popup/index.html',
    }),
    new HtmlWebpackPlugin({
      template: resSrc('options', 'index.html'),
      inject: 'body',
      chunks: ['options/options'],
      filename: 'dist/options/index.html',
    }),
    // new HtmlWebpackInlineSVGPlugin(),
    // write css file(s) to build folder
    new MiniCssExtractPlugin({ filename: 'css/[name].css' }),
    // copy static assets
    new CopyWebpackPlugin({
      patterns: [
        { from: resSrc('../public/assets'), to: 'assets' },
        {
          from: resRoot(
            'node_modules/webextension-polyfill/dist/browser-polyfill.js',
          ),
          to: 'lib/browser-polyfill.js',
        },
      ],
    }),
  ],

  optimization: {
    // todo no need webpack 5 // esbuild ?
    minimize: true,
    minimizer: [
      new ESBuildMinifyPlugin({
        target: 'es2018', // Syntax to compile to (see options below for possible values)
        tsconfigRaw: require('../../tsconfig.json'),
      }),
      // todo no need webpack 5 // esbuild ?
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          format: {
            comments: false,
          },
        },
        extractComments: false,
      }),
      // todo no need webpack 5 // esbuild ?
      new OptimizeCSSAssetsPlugin({
        cssProcessorPluginOptions: {
          preset: ['default', { discardComments: { removeAll: true } }],
        },
      }),
      isProd &&
        new FilemanagerPlugin({
          events: {
            onEnd: {
              archive: [
                {
                  format: 'zip',
                  source: resRoot(OUTDIR_WEBPACK_NAME, targetBrowser),
                  destination: resRoot(
                    OUTDIR_WEBPACK_NAME,
                    `${targetBrowser}.${getExtensionFileType(targetBrowser)}`,
                  ),

                  options: { zlib: { level: 6 } },
                },
              ],
            },
          },
        }),
    ].filter((n) => n),

    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks(chunk) {
            return chunk.name !== 'background';
          },
        },
      },
    },
  },

  context: __dirname,
};

export {};

export default config;
