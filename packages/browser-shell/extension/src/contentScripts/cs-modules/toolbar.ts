import {
  msComponentDestroyStream,
  msComponentInitStream,
} from '@workspace/extension-common';
import {
  createInPageUI,
  destroyFrontendToolbar,
  destroyInPageUI,
  InPageUIRootMount,
  setupFrontendToolbar,
} from '@workspace/extension-ui';
import browser from 'webextension-polyfill';

import { ToolbarScriptMain } from '../types';

export const toolbarMain: ToolbarScriptMain = async (dependencies) => {
  const cssFile = __IS_CRXJS__
    ? ''
    : browser.runtime.getURL('css/contentScripts/cs.toolbar.css');

  let mount: InPageUIRootMount;
  const createMount = () => {
    if (!mount) {
      mount = createInPageUI('toolbar', cssFile);
    }
  };
  createMount();

  msComponentInitStream.subscribe(async ([{ component }, sender]) => {
    if (component !== 'toolbar') return;
    console.log('TOOLBAR -> S ETU P <-', component);

    await setUp();
  });

  msComponentDestroyStream.subscribe(async ([{ component }, sender]) => {
    if (component !== 'toolbar') return;
    console.log('TOOLBAR -> DESTROY <-', component);
    destroy();
  });

  const setUp = async () => {
    createMount();
    setupFrontendToolbar(mount, {
      ...dependencies,
    });
  };

  const destroy = () => {
    if (!mount) {
      return;
    }

    destroyInPageUI('toolbar');
    // destroyFrontendToolbar(mount.rootElement, mount.shadowRoot);
  };
};
