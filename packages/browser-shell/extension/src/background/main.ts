import {
  msComponentInitStream,
  msSendComponentInit,
  msComponentDestroyStream,
  msSendComponentDestroy,
  msInPageUiStateStream,
  msSendInPageUiState,
  msSharedStateSettingsStream,
  msSendSharedStateSettings,
} from '@workspace/extension-common';
import browser from 'webextension-polyfill';
import { createBackgroundModules, setupBackgroundModules } from './setup';

export const main = async ({
  contentScriptsPaths,
}: {
  contentScriptsPaths: any;
}) => {
  // msComponentInitStream.subscribe(
  //   async ([{ component, scriptSender }, sender]) => {
  //     console.log(component, scriptSender);
  //     await msSendComponentInit(
  //       { component, scriptSender },
  //       { tabId: sender.tab?.id },
  //     );
  //   },
  // );

  /**
   * Initial all Background Modules with shared Plugins
   * - Database Management - Browser Apis etc. ...
   */
  const backgroundModules = await createBackgroundModules({
    browserAPIs: browser,
    contentScriptsPaths,
  });

  /**
   * Extension install, update logic etc.
   * Initial modules, setup modul EventListeners etc.
   */
  await setupBackgroundModules(backgroundModules);
};
