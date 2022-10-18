import browser, { Runtime, Tabs, WebNavigation } from 'webextension-polyfill';
import {
  ContentScriptComponent,
  msInjectScriptStream,
} from '@workspace/extension-common';

export class ContentScriptsBackground {
  constructor(
    private options: {
      getTab: Tabs.Static['get'];
      getURL: Runtime.Static['getURL'];
      webNavigation: WebNavigation.Static;
      contentScriptsPaths: any;
    },
  ) {
    this.options.webNavigation.onHistoryStateUpdated.addListener(
      this.handleHistoryStateUpdate,
    );

    this.messagesStream();
  }

  private messagesStream() {
    msInjectScriptStream.subscribe(async ([{ filename }, sender]) => {
      await this.injectContentScriptComponent({
        tabId: sender.tab?.id,
        component: filename,
      });
    });
  }

  injectContentScriptComponent = async ({
    tabId,
    component,
  }: {
    tabId: Tabs.Tab['id'];
    component: ContentScriptComponent;
  }): Promise<void> => {
    await browser.scripting
      .executeScript({
        target: { tabId: tabId as number, allFrames: true },
        files: [this.options.contentScriptsPaths[component]],
      })
      .then(() => {
        console.log(`worker.ts inject script '${component}' in Tab ${tabId}`);
      })
      .catch((error) =>
        console.error(`worker.ts inject error Tab ${tabId}`, error),
      );
  };

  //   injectContentScriptComponent = async ({
  //     tabId,
  //     component,
  //   }: {
  //     tabId: Tabs.Tab['id'];
  //     component: string;
  //   }): Promise<void> => {
  //     // @ts-ignore
  //     // if (window.contentScriptInjected !== true) {
  //     await browser.tabs
  //       .executeScript(tabId, {
  //         file: `${false ? '' : '.'}/dist/contentScripts/index.${component}.js`, // isFirefox
  //         runAt: 'document_end',
  //       })
  //       .then(() => {
  //         console.log(`inject script '${component}' in Tab ${tabId}`);
  //         // @ts-ignore
  //         // window.contentScriptInjected = true;
  //       })
  //       .catch((error) => console.error(error));
  //     // }
  //   };

  private handleHistoryStateUpdate = async ({
    tabId,
    url,
  }: WebNavigation.OnHistoryStateUpdatedDetailsType) => {
    // const isSidebarEnabled = await getSidebarState();
    // if (!isSidebarEnabled) {
    //   return;
    // }
    // const inPage = runInTab<InPageUIContentScriptRemoteInterface>(tabId);
    // await inPage.removeHighlights();
    // await inPage.reloadRibbon();
    // setTimeout(async () => {
    //   console.log('# BG handleHistoryStateUpdate ', url);
    //   await ms_sendReloadRibbon({}, { tabId });
    // }, 300);
  };
}
