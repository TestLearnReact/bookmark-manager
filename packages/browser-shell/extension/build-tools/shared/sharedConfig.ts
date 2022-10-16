import path from 'path';
import { resRootPackages, resSrc } from './sharedUtils';

export const packages = [
  'extension',
  'extension-ui',
  'extension-common',
  'extension-externals/message-system',
];

// alias: {
//   '@workspace/extension': resSrc(),
//   '@workspace/extension-ui': resSrc('../../extension-ui/src'),
//   '@workspace/extension-common': resSrc('../../extension-common/src'),
//   '@workspace/message-system': resSrc(
//     '../../extension-externals/message-system/src',
//   ),
//   '~icons/public-assets-icons/*': resSrc('../public/assets/icons/'),
// },

export const aliasVite = {
  // '@workspace/extension': resSrc(),
  // '@workspace/extension-ui': resRootPackages('extension-ui/src'),
  // '@workspace/extension-common': resRootPackages('extension-common/src'),
  // '@workspace/message-system': resRootPackages(
  //   'extension-externals/message-system/src',
  // ),
  '~icons/public-assets-icons/*': resSrc('../public/assets/icons/'),

  // '~icons/public-assets-icons/*': resSrc('../public/assets/icons/'),
  // '@extension": ': resSrc(),
  // // '@extension": ': resSrc(),
  // '@workspace/extension-ui/*": ': resRootPackages(
  //   'packages/extension-ui/src/*',
  // ),
  // // '@workspace/extension-ui": ': resRootPackages('packages/extension-ui/src'),
};

export const aliasWebpack = {
  // '@workspace/extension': resSrc(),
  // '@workspace/extension-ui': resRootPackages('extension-ui/src'),
  // '@workspace/extension-common': resRootPackages('extension-common/src'),
  // '@workspace/message-system': resRootPackages(
  //   'extension-externals/message-system/src',
  // ),
  '~icons/public-assets-icons': resSrc('../public/assets/icons/'),
};

export const getAlias = (alias) =>
  packages.reduce(
    (alias, p) => ({
      ...alias,
      [`@workspace/${p}`]: path.resolve(__dirname, `../../../${p}/src`),
    }),
    alias,
  );
