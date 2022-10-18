import browser from 'webextension-polyfill';
import { createBackgroundModules, setupBackgroundModules } from './setup';

export const main = async ({
  contentScriptsPaths,
}: {
  contentScriptsPaths: any;
}) => {
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
