/* eslint-disable @typescript-eslint/ban-ts-comment */
import browser, { Tabs, Browser } from 'webextension-polyfill';

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
import {
  msSendBackgroundEmittedData,
  msSetTabAsIndexedStream,
  resolvablePromise,
} from '@workspace/extension-common';
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
import {
  createTab,
  createTabPos,
  // createOrUpdateTab,
  // createTab,
  // createTabIfNeeded,
  Database,
  handleIsOpen,
  handleToggleIsActive,
  // deleteTab,
  // findTabById,
  // isTabIndexed,
  Q,
  syncWatermelonDbFrontends,
  TableName,
  TabModel,
} from '@workspace/extension-base/modules/watermelon';

export const getValidUrl = (url = '') => {
  let newUrl = window.decodeURIComponent(url);
  newUrl = newUrl.trim().replace(/\s/g, '');

  if (/^(:\/\/)/.test(newUrl)) {
    return `http${newUrl}`;
  }
  if (!/^(f|ht)tps?:\/\//i.test(newUrl)) {
    return `http://${newUrl}`;
  }

  return newUrl;
};

const SCROLL_UPDATE_FN = 'updateScrollState';
const CONTENT_SCRIPTS = ['/lib/browser-polyfill.js', '/content_script.js'];

export interface TabManagementEvents {
  tabRemoved(event: { tabId: number }): void;
}

export class TabManagementBackground {
  tabManager: TabManager;
  database: Database;

  _indexableTabs: { [tabId: number]: true } = {};
  _openTabs: TabModel[] = [];
  _tabsToSync = new Map<
    number,
    {
      id: number;
      url: string;
      title: string;
      isOpen: boolean;
      isActive: boolean;
      isCsInjected: boolean;
    }
  >();

  // todo injetable tabs map -> only isOpen, cs script is injected

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
        'tabs' | 'runtime' | 'webNavigation' | 'storage' | 'windows' | 'history'
      >;
      contentScriptsPaths: any;
      database: Database;
    },
  ) {
    this.tabManager = options.tabManager;
    this.database = options.database;

    msSetTabAsIndexedStream.subscribe(async ([_, sender]) => {
      const id = sender.tab?.id || -1;

      if (id <= 0) return;

      // update
      if (this.tabManager.isTracked(id)) {
        // send({updated: [{}]})
      }

      // create
      if (!this.tabManager.isTracked(id)) {
        const oldTab = this._tabsToSync.get(id);
        await this.trackNewTab(id, {
          isActive: oldTab?.isActive || false,
          isCsInjected: true,
        });

        // send({created: [{}]})
      }

      // const oldTab = this._tabsToSync.get(id);

      // this._tabsToSync.set(id, {
      //   id: id,
      //   url: sender.tab?.url || '',
      //   title: sender.tab?.title || '',
      //   isOpen: true,
      //   isActive: oldTab?.isActive || false,
      //   isCsInjected: true,
      // });

      console.log('llllllllll', sender.tab, this._tabsToSync);
    });

    // ms_setTabAsIndexableStream.subscribe(([{ tab }, sender]) => {
    //   const tabId = tab?.id || sender.tab?.id || -1; // todo tab? -1
    //   this._indexableTabs[tabId] = true;
    // });

    // ms_fetchTabStream.subscribe(([{ tabId, url }, sender]) => {
    //   tabId && this.tabManager.getTabState(tabId);
    //   url && this.tabManager.getTabStateByUrl(url);
    // });

    // this.setupWebExtAPIHandlers(); //
  }

  static isTabLoaded = (tab: Tabs.Tab) => tab.status === 'complete';

  async setupWebExtAPIHandlers() {
    // this.setupScrollStateHandling();
    // this.setupNavStateHandling();
    await this.setupTabLifecycleHandling();
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

    console.log('trackExistingTabs()................', tabs);

    await mapChunks(tabs, CONCURR_TAB_LOAD, async (tab) => {
      // @ts-ignore

      if (this.tabManager.isTracked(tab.id)) {
        return;
      }
      // @ts-ignore
      this.trackNewTab(tab.id);
      // todo check
      // this.tabManager.trackTab(tab, {
      //   isLoaded: TabManagementBackground.isTabLoaded(tab),
      // });

      await this.injectContentScripts(tab);
    });

    this.trackingExistingTabs.resolve();
  }

  private async trackNewTab(
    id: number,
    fields?: { isActive: boolean; isCsInjected: boolean },
  ) {
    const browserTab = await this.options.browserAPIs.tabs.get(id);

    this.tabManager.trackTab(browserTab, {
      isLoaded: TabManagementBackground.isTabLoaded(browserTab),
    });

    this._tabsToSync.set(browserTab.id!, {
      id: browserTab.id!,
      url: browserTab.url || '',
      title: browserTab.title || '',
      isOpen: true,
      isActive: fields?.isActive || false,
      isCsInjected: fields?.isCsInjected || false,
    });

    // const create = await createTab({
    //   database: this.database,
    //   fields: {
    //     apiTabId: browserTab.id?.toString() || '-1',
    //     isActive: false,
    //     isOpen: true,
    //   },
    // });

    // let ids = [] as number[];
    // this._openTabs.map((tab) => ids.push(Number(tab.apiTabId)));

    // await syncWatermelonDbFrontends({
    //   database: this.database,
    //   sendToTabIds: ids,
    // });

    // this._openTabs = await this.database.collections
    //   .get<TabModel>(TableName.TABS)
    //   .query(Q.where('is_open', true))
    //   .fetch();
  }

  async injectContentScripts(tab: Tabs.Tab) {
    const isLoggable = true; // await this.shouldLogTab(tab);
    if (!isLoggable) {
      return;
    }

    // dev checken / try mssendasindeaed

    // this._tabsToSync.set(tab.id || -1, {
    //   id: tab.id!,
    //   isOpen: true,
    //   isActive: true,
    // });

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

  private async setupTabLifecycleHandling() {
    /** */
    this.options.browserAPIs.tabs.onCreated.addListener(async (tab) => {
      if (!tab.id) {
        return;
      }

      // this._tabsToSync.set(tab.id, {
      //   id: tab.id,
      //   url: tab.url || '',
      //   title: tab.title || '',
      //   isOpen: true,
      //   isActive: true,
      //   isCsInjected: false,
      // });

      console.log('-- onCreated --', tab.id, this._tabsToSync);
    });

    /** */
    this.options.browserAPIs.tabs.onActivated.addListener(
      async (activeInfo) => {
        if (!this.tabManager.isTracked(activeInfo.tabId)) {
          await this.trackNewTab(activeInfo.tabId);
        }

        // await handleToggleIsActive({
        //   database: this.database,
        //   toggleArr: this._openTabs,
        //   actTabId: tabId,
        // });

        for (const [xtabId, tab] of this._tabsToSync) {
          // Toggle active state on currently active and the new candidate tab
          if (tab.isActive || xtabId === activeInfo.tabId) {
            this._tabsToSync.set(xtabId, { ...tab, isActive: !tab.isActive });
          }
        }

        console.log(
          '-- onActivated --',
          activeInfo.tabId,
          activeInfo.previousTabId,
          this._tabsToSync,
        );

        this.tabManager.activateTab(activeInfo.tabId);
      },
    );

    /** */
    this.options.browserAPIs.tabs.onRemoved.addListener(
      async (tabId, removeInfo) => {
        const tab = this.tabManager.removeTab(tabId);
        delete this._indexableTabs[tabId];
        // const xxx = await handleIsOpen({
        //   database: this.database,
        //   actTabId: tabId,
        // });
        this._tabsToSync.delete(tabId);

        console.log('-- onRemove --');
      },
    );

    let tabIdToPreviousUrl = {};
    let shouldUpdate = false;

    /** */
    this.options.browserAPIs.tabs.onUpdated.addListener(
      async (tabId, changeInfo, tabinfo) => {
        if (!this.tabManager.isTracked(tabId)) {
          await this.trackNewTab(tabId);
        }

        // check for browser history should update
        if (changeInfo.url) {
          shouldUpdate = false;
          let previousUrl = '';
          if (tabId in tabinfo) {
            previousUrl = tabIdToPreviousUrl[tabId];
          }
          // If the domain is different perform action.
          if (previousUrl !== changeInfo.url) {
            // do something
            shouldUpdate = true;
          }
          // Add the current url as previous url
          tabIdToPreviousUrl[tabId] = changeInfo.url;
        }

        // history should update tab  is complete loaded
        if (shouldUpdate && changeInfo.status === 'complete') {
          // console.log('OPEN::::', this._openTabs);
          // this._openTabs.map((tab) =>
          //   msSendBackgroundEmittedData(
          //     { onUpdated: { tabId, tabinfo, changeInfo } },
          //     { tabId: Number(tab.apiTabId) },
          //   ),
          // );

          const pattern = /^((http|https|ftp):\/\/)/;

          // url !starts http
          this._tabsToSync.set(tabinfo.id!, {
            id: tabinfo.id!,
            url: tabinfo.url || '',
            title: tabinfo.title || '',
            isOpen: true,
            isActive: true,
            isCsInjected: pattern.test(tabinfo.url || ''),
          });

          // const create = await createTabPos({
          //   database: this.database,
          //   fields: {
          //     apiTabId: tabinfo.id?.toString() || '-1',
          //     url: tabinfo.url!,
          //     title: tabinfo.title!,
          //   },
          // });

          // let ids = [] as number[];
          // this._openTabs.map((tab) => ids.push(Number(tab.apiTabId)));

          // await syncWatermelonDbFrontends({
          //   database: this.database,
          //   sendToTabIds: ids,
          // });
          // console.log(
          //   '###########---->>>>>',
          //   create,
          //   tabId,
          //   ids,
          //   this._openTabs,
          //   await this.getOpenTabsInCurrentWindow(),
          // );
        }

        // await syncWatermelonDbFrontends({
        //   database: this.database,
        // });

        console.log('-- onUpdate --', tabId, changeInfo, tabinfo);
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
    console.log('tabUpdatedListener');
    if (changeInfo.status) {
      this.tabManager.setTabLoaded(tabId, changeInfo.status === 'complete');
    }
  };
}
