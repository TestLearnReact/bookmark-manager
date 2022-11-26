import { msSendSetTabAsIndexed } from '@workspace/extension-common';
import { csMainModule } from './main';

import { sidebarMain } from './sidebar';
import { toolbarMain } from './toolbar';

/**
 * CS Module for development without injecting
 * Change MakeHMRworking to makeHMRworking for vite reload instead of hmr
 */
export const MakeHMRworking = async () => {
  await csMainModule({
    loadRemotely: true,
    devScripts: {
      toolbarDevModule: toolbarMain,
      sidebarDevModule: sidebarMain,
    },
  });
  // await msSendSetTabAsIndexed()
  //   .then((res) => console.log('indexed', res))
  //   .catch((err) => console.log('not indexed', err));
};

MakeHMRworking();
