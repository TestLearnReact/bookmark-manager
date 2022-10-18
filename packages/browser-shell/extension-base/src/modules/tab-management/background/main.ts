/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Tabs, Browser } from 'webextension-polyfill';

// import { mapChunks } from 'src/util/chunk'
import { mapChunks } from './utils';
// import { CONCURR_TAB_LOAD } from '../constants'
import { CONCURR_TAB_LOAD } from './constants';
// import {
//     registerRemoteFunctions,
//     remoteFunctionWithExtraArgs,
//     remoteFunctionWithoutExtraArgs,
// } from 'src/util/webextensionRPC'
import { TabManager } from './tab-manager';
import { TabChangeListener } from './types'; // TabManagementInterface
import { resolvablePromise } from '@workspace/extension-common';
// // import { RawPageContent } from '../../page-analysis/'; // types
// // import { fetchFavIcon } from '../../page-analysis/'; // background/get-fav-icon
// // import {
// //   ms_fetchTabStream,
// //   ms_sendExtractRawPageContent,
// //   ms_setTabAsIndexableStream,
// // } from '@project/shared-utils';
// import { resolvablePromise } from 'src/util/resolvable'
// import { RawPageContent } from 'src/page-analysis/types'
// import { fetchFavIcon } from 'src/page-analysis/background/get-fav-icon'
// import { LoggableTabChecker } from 'src/activity-logger/background/types'
// import { isLoggable, getPauseState } from 'src/activity-logger'
// import { blacklist } from 'src/blacklist/background'
// import TypedEventEmitter from 'typed-emitter'
// import { EventEmitter } from 'events'

const SCROLL_UPDATE_FN = 'updateScrollState';
const CONTENT_SCRIPTS = ['/lib/browser-polyfill.js', '/content_script.js'];

export interface TabManagementEvents {
  tabRemoved(event: { tabId: number }): void;
}

export class TabManagementBackground {
  tabManager: TabManager;

  _indexableTabs: { [tabId: number]: true } = {};

  /**
   * Used to stop of tab updated event listeners while the
   * tracking of existing tabs is happening.
   */
  private trackingExistingTabs = resolvablePromise(); // todo doppelt deklariert

  constructor(
    private options: {
      tabManager: TabManager;
      browserAPIs: Pick<
        Browser,
        'tabs' | 'runtime' | 'webNavigation' | 'storage' | 'windows'
      >;
      contentScriptsPaths: any;
    },
  ) {
    this.tabManager = options.tabManager;

    // ms_setTabAsIndexableStream.subscribe(([{ tab }, sender]) => {
    //   const tabId = tab?.id || sender.tab?.id || -1; // todo tab? -1
    //   this._indexableTabs[tabId] = true;
    // });

    // ms_fetchTabStream.subscribe(([{ tabId, url }, sender]) => {
    //   tabId && this.tabManager.getTabState(tabId);
    //   url && this.tabManager.getTabStateByUrl(url);
    // });

    this.setupWebExtAPIHandlers(); //
  }

  static isTabLoaded = (tab: Tabs.Tab) => tab.status === 'complete';

  setupWebExtAPIHandlers() {
    // this.setupScrollStateHandling();
    // this.setupNavStateHandling();
    this.setupTabLifecycleHandling();
  }

  //   async extractRawPageContent(tabId: number): Promise<RawPageContent> {
  //     let response;
  //     await ms_sendExtractRawPageContent({}, { tabId }).then((res) => {
  //       response = res;
  //     });
  //     return response;
  //   }

  async getOpenTabsInCurrentWindow(): Promise<
    Array<{ id: number; url: string }>
  > {
    const windowId = this.options.browserAPIs.windows.WINDOW_ID_CURRENT;
    return (await this.options.browserAPIs.tabs.query({ windowId }))
      .map((tab) => ({ id: tab.id!, url: tab.url! })) // tab.url! todo
      .filter(
        (tab) =>
          tab.id &&
          tab.url &&
          tab.id !== this.options.browserAPIs.tabs.TAB_ID_NONE,
      );
  }

  //   async getFavIcon({ tabId }: { tabId: number }) {
  //     const tab = await this.options.browserAPIs.tabs.get(tabId);

  //     if (tab?.favIconUrl == null || tab?.favIconUrl === '') {
  //       // todo ''
  //       return undefined;
  //     }

  //     return fetchFavIcon(tab.favIconUrl);
  //   }

  async findTabIdByFullUrl(fullUrl: string) {
    const tabs = await this.options.browserAPIs.tabs.query({ url: fullUrl });
    return tabs.length ? tabs[0].id : null;
  }

  async trackExistingTabs() {
    const tabs = await this.options.browserAPIs.tabs.query({});

    await mapChunks(tabs, CONCURR_TAB_LOAD, async (tab) => {
      // @ts-ignore
      if (this.tabManager.isTracked(tab.id)) {
        return;
      }

      this.tabManager.trackTab(tab, {
        isLoaded: TabManagementBackground.isTabLoaded(tab),
      });

      await this.injectContentScripts(tab);
    });

    this.trackingExistingTabs.resolve();
  }

  private async trackNewTab(id: number) {
    const browserTab = await this.options.browserAPIs.tabs.get(id);

    this.tabManager.trackTab(browserTab, {
      isLoaded: TabManagementBackground.isTabLoaded(browserTab),
    });
  }

  async injectContentScripts(tab: Tabs.Tab) {
    // const isLoggable = await this.shouldLogTab(tab);
    // if (!isLoggable) {
    //   return;
    // }
    // for (const file of CONTENT_SCRIPTS) {
    //   await this.options.browserAPIs.tabs
    //     .executeScript(tab.id, { file })
    //     .catch((err) =>
    //       console.error(
    //         "Cannot inject content-scripts into page - reason:",
    //         err.message
    //       )
    //     );
    // }
  }

  /**
   * Combines all "loggable" conditions for logging on given tab data to determine
   * whether or not a tab should be logged.
   */
  //   shouldLogTab: LoggableTabChecker = async function({ url }) {
  //     // Short-circuit before async logic, if possible
  //     if (!url || !isLoggable({ url })) {
  //       return false;
  //     }

  //     // First check if we want to log this page (hence the 'maybe' in the name).
  //     const isBlacklisted = await blacklist.checkWithBlacklist(); // tslint:disable-line
  //     const isPaused = await getPauseState();

  //     return !isPaused && !isBlacklisted({ url });
  //   };

  /**
   * Ensure tab scroll states are kept in-sync with scroll events from the content script.
   */
  private setupScrollStateHandling() {
    this.options.browserAPIs.runtime.onMessage.addListener(
      ({ funcName, ...scrollState }, { tab }) => {
        if (funcName !== SCROLL_UPDATE_FN || tab == null) {
          return;
        }
        // @ts-ignore
        this.tabManager.updateTabScrollState(tab.id, scrollState);
      },
    );
  }

  private setupTabLifecycleHandling() {
    this.options.browserAPIs.tabs.onCreated.addListener((tab) => {
      if (!tab.id) {
        return;
      }
      this.tabManager.trackTab(tab);
      // /console.log(":: tabs.onCreated:: ", tab);
    });

    this.options.browserAPIs.tabs.onActivated.addListener(async ({ tabId }) => {
      if (!this.tabManager.isTracked(tabId)) {
        await this.trackNewTab(tabId);
      }
      // /console.log(":: tabs.onActivated:: ", tabId);
      this.tabManager.activateTab(tabId);
    });

    this.options.browserAPIs.tabs.onRemoved.addListener((tabId, removeInfo) => {
      const tab = this.tabManager.removeTab(tabId);
      delete this._indexableTabs[tabId];

      if (tab != null) {
        //  this.events.emit("tabRemoved", { tabId });
      }

      // /console.log("tabs.onRemoved:: ", tabId, removeInfo);
    });

    this.options.browserAPIs.tabs.onUpdated.addListener(
      async (tabId, changeInfo, tabinfo) => {
        // /console.log(":: tabs.onUpdated:: ", tabId, changeInfo, tabinfo);
        // if (!this.tabManager.isTracked(tabId)) {
        //   console.log("track newTab onUpdatetd 1", tabId);
        //   await this.trackNewTab(tabId);
        // }
        // console.log("browserAPIs.tabs.onUpdated", tabId, changeInfo, tabinfo);
        // const { id, index, title } = tabinfo;
        // //this.tabManager.trackTab(tabinfo, { id, title });
        // this.tabManager.trackTab(tabinfo);
        // //this.tabManager.activateTab(tabId);
      },
    );
  }

  /**
   * The `webNavigation.onCommitted` event gives us some useful data related to how the navigation event
   * occured (client/server redirect, user typed in address bar, link click, etc.). Might as well keep the last
   * navigation event for each tab in state for later decision making.
   */
  private setupNavStateHandling() {
    this.options.browserAPIs.webNavigation.onCommitted.addListener(
      ({ tabId, frameId, ...navData }: any) => {
        // Frame ID is always `0` for the main webpage frame, which is what we care about
        if (frameId === 0) {
          this.tabManager.updateNavState(tabId, {
            type: navData.transitionType,
            qualifiers: navData.transitionQualifiers,
          });
        }
      },
    );
  }

  private tabUpdatedListener: TabChangeListener = async (
    tabId,
    changeInfo,
    tab,
  ) => {
    await this.trackingExistingTabs;

    if (changeInfo.status) {
      this.tabManager.setTabLoaded(tabId, changeInfo.status === 'complete');
    }
  };
}
