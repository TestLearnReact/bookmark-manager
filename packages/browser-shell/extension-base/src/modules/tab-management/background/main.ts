/* eslint-disable @typescript-eslint/ban-ts-comment */
import browser, { Tabs, Browser, bookmarks } from 'webextension-polyfill';
import { mapChunks } from './utils';
import { CONCURR_TAB_LOAD } from './constants';
import { TabManager } from './tab-manager';
import { TabChangeListener } from './types'; // TabManagementInterface
import {
  msSendPushArgs,
  msSetTabAsIndexedStream,
  resolvablePromise,
} from '@workspace/extension-common';
import {
  createTab,
  createTabPos,
  Database,
  DbManagement,
  SyncDatabaseChangeSet,
  TableName,
  TabModel,
} from '@workspace/extension-base/modules/watermelon';

const SCROLL_UPDATE_FN = 'updateScrollState';
const CONTENT_SCRIPTS = ['/lib/browser-polyfill.js', '/content_script.js'];

export interface TabManagementEvents {
  tabRemoved(event: { tabId: number }): void;
}

type RawPageContent = any;

export class TabManagementBackground {
  tabManager: TabManager;
  database: Database;
  dbManagement: DbManagement;

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
        | 'tabs'
        | 'runtime'
        | 'webNavigation'
        | 'storage'
        | 'windows'
        | 'history'
        | 'scripting'
      >;
      contentScriptsPaths: any;
      database: Database;
      dbManagement: DbManagement;
    },
  ) {
    this.tabManager = options.tabManager;
    this.database = options.database;
    this.dbManagement = options.dbManagement; // new DbManagement({ database: this.database });
  }

  static isTabLoaded = (tab: Tabs.Tab) => tab.status === 'complete';

  async setupWebExtAPIHandlers() {
    await this.messages();
    // this.setupScrollStateHandling();
    // this.setupNavStateHandling();
    await this.setupTabLifecycleHandling();
  }

  async messages() {
    msSetTabAsIndexedStream.subscribe(async ([_, sender]) => {
      const id = sender.tab?.id || -1;
      if (id <= 0) return;

      await this.setTabAsIndexable(id);
    });
  }

  private async setTabAsIndexable(id: number) {
    const oldTab = this._tabsToSync.get(id);

    // update
    if (this.tabManager.isTracked(id)) {
      if (oldTab) {
        this._tabsToSync.set(oldTab.id!, {
          ...oldTab,
          isOpen: true,
          isActive: oldTab?.isActive || true, // false,
          isCsInjected: true,
        });
      }
    }

    // create
    if (!this.tabManager.isTracked(id)) {
      await this.trackNewTab(id, {
        isActive: oldTab?.isActive || true, // false,
        isCsInjected: true,
      });
    }

    // dont work for some reason / values dont pass throug message-system
    // const changesFromBg = await this.dbManagement.getChanges({
    //   tables: ['bookmarks'],
    // });

    const changesFromBg = await this.dbManagement.getChanges2({
      // tables: ['bookmarks'],
    });

    console.log('### init send sync ###', changesFromBg);
    await msSendPushArgs(
      {
        changes: changesFromBg,
        lastPulledAt: Date.now(),
      },
      { tabId: id },
    )
      .then((r) => console.log('### true', r))
      .catch((r) => console.log('### false', r));
  }

  async extractRawPageContent(tabId: number): Promise<RawPageContent> {
    let response;
    // await ms_sendExtractRawPageContent({}, { tabId }).then((res) => {
    //   response = res;
    // });
    return response;
  }

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
  }

  async injectContentScripts(tab: Tabs.Tab) {
    const isLoggable = true; // await this.shouldLogTab(tab);
    if (!isLoggable || !tab.id) {
      return;
    }

    const oldTab = this._tabsToSync.get(tab.id); // todo right place

    // work with vite modules, no need to inject
    if (__DEV__ && window.location.href.startsWith('chrome-extension://'))
      return;

    for (const file of CONTENT_SCRIPTS) {
      await this.options.browserAPIs.scripting
        .executeScript({
          target: { tabId: tab.id as number, allFrames: true },
          files: [this.options.contentScriptsPaths['todo main script']],
        })
        .then(() => {
          this._tabsToSync.set(tab.id!, { ...oldTab!, isCsInjected: true });

          console.log(
            `worker.ts inject script '${'todo main script'}' in Tab ${tab.id}`,
          );
        })
        .catch((error) =>
          console.error(`worker.ts inject error Tab ${tab.id}`, error),
        );
    }
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

      const newTab = createTab({
        database: this.database,
        fields: { apiTabId: tab.id.toString(), isActive: true, isOpen: true }, // todo check string/number apitabid
      });

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
          // if (tab.isActive || xtabId === activeInfo.tabId) {
          //   this._tabsToSync.set(xtabId, { ...tab, isActive: !tab.isActive });
          // }
          if (tab.isActive && xtabId !== activeInfo.tabId) {
            this._tabsToSync.set(xtabId, { ...tab, isActive: false });
          }
          if (xtabId === activeInfo.tabId) {
            this._tabsToSync.set(xtabId, { ...tab, isActive: true });
          }
        }

        console.log(
          '-- onActivated --',
          activeInfo.tabId,

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
            console.log(
              'do something prev: ',
              previousUrl,
              'changeInfo.url:',
              changeInfo.url,
            );

            shouldUpdate = true;
          }
          // Add the current url as previous url
          tabIdToPreviousUrl[tabId] = changeInfo.url;
        }

        // history should update tab  is complete loaded
        if (shouldUpdate && changeInfo.status === 'complete' && tabinfo.id) {
          console.log(shouldUpdate, changeInfo.status, tabinfo.id);

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

          const create = await createTabPos({
            database: this.database,
            fields: {
              apiTabId: tabinfo.id?.toString(),
              url: tabinfo.url!,
              title: tabinfo.title!,
            },
          });

          shouldUpdate = false;

          console.log('-- onUpdate --', tabId, tabinfo, create);
        }
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

// https://gilfink.medium.com/quick-tip-using-the-chrome-devtools-fps-meter-1bb400b63f7

// https://usehooks-ts.com/react-hook/use-intersection-observer
// https://gist.github.com/ExcitedSpider/edbb2781d8c09ab16cf34eb2826a5bd0
// https://github.com/pmmm114/react-virtual-scroll-hook
// https://github.com/onderonur/react-infinite-scroll-hook/blob/master/src/useInfiniteScroll.ts

// https://codesandbox.io/s/react-virtual-scroll-hook-nhzkrc?file=/src/index.js:979-994
// https://codesandbox.io/s/214p1911yn?file=/src/index.js
