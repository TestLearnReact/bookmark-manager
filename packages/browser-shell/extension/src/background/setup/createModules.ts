import {
  ContentScriptsBackground,
  DbManagement,
  genWatermelonDb,
  MainModuleBackground,
  messageBridgeCsBgCs,
  TabManagementBackground,
  TabManager,
  WatermelonDbBackground,
} from '@workspace/extension-base';
import { Browser, type Tabs } from 'webextension-polyfill';

export interface IBackgroundModules {
  tabManagementBackground: TabManagementBackground;
  watermelonDbBackround: WatermelonDbBackground;
  dbManagement: DbManagement;
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
  /** */
  await messageBridgeCsBgCs();

  const getNow = () => Date.now();

  const database = await genWatermelonDb({
    dbName: 'WaterBg',
  });

  try {
    await database.write(async () => await database.unsafeResetDatabase());
  } catch (error) {
    console.log('errr');
  }

  const dbManagement = new DbManagement({ database });

  /** */
  const tabManager = new TabManager();
  const tabManagementBackground = new TabManagementBackground({
    tabManager,
    browserAPIs: options.browserAPIs,
    contentScriptsPaths: options.contentScriptsPaths,
    database,
    dbManagement,
  });

  /** */
  const mainModuleBackground = new MainModuleBackground({
    tabManagementBackground,
  });

  /** */
  const contentScriptBackground = new ContentScriptsBackground({
    database,
    webNavigation: options.browserAPIs.webNavigation,
    getURL: bindMethod(options.browserAPIs.runtime, 'getURL'),
    getTab: bindMethod(options.browserAPIs.tabs, 'get'),
    contentScriptsPaths: options.contentScriptsPaths,
  });

  const watermelonDbBackround = new WatermelonDbBackground({
    database,
    tabManagementBackground,
  });

  return {
    tabManagementBackground,
    mainModuleBackground,
    contentScriptBackground,
    watermelonDbBackround,
    dbManagement,
  };
}

// todo utils
export const bindMethod = <Target, Key extends keyof Target>(
  object: Target,
  key: Key,
): Target[Key] => (object[key] as any).bind(object);
