import {
  ContentScriptsBackground,
  MainModuleBackground,
  messageBridgeCsBgCs,
  TabManagementBackground,
  TabManager,
} from '@workspace/extension-base';
import { Browser } from 'webextension-polyfill';

export interface IBackgroundModules {
  tabManagementBackground: TabManagementBackground;
  // pageIndexingBackground: PageIndexingBackground;
  mainModuleBackground: MainModuleBackground;
  contentScriptBackground: ContentScriptsBackground;
}

/**
 * Register Modules
 *  */
export async function createBackgroundModules(options: {
  browserAPIs: Browser;
  contentScriptsPaths: any;
}): Promise<IBackgroundModules> {
  await messageBridgeCsBgCs();

  const getNow = () => Date.now();

  /** */
  const tabManager = new TabManager();
  const tabManagementBackground = new TabManagementBackground({
    tabManager,
    browserAPIs: options.browserAPIs,
    contentScriptsPaths: options.contentScriptsPaths,
  });

  /** */
  const mainModuleBackground = new MainModuleBackground({
    tabManagementBackground,
  });

  /** */
  const contentScriptBackground = new ContentScriptsBackground({
    webNavigation: options.browserAPIs.webNavigation,
    getURL: bindMethod(options.browserAPIs.runtime, 'getURL'),
    getTab: bindMethod(options.browserAPIs.tabs, 'get'),
    contentScriptsPaths: options.contentScriptsPaths,
  });

  return {
    tabManagementBackground,
    mainModuleBackground,
    contentScriptBackground,
  };
}

// todo utils
export const bindMethod = <Target, Key extends keyof Target>(
  object: Target,
  key: Key,
): Target[Key] => (object[key] as any).bind(object);
