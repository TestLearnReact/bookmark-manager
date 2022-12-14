import {
  syncWatermelonDbFrontends,
  genWatermelonDb,
  createTabPos,
} from '@workspace/extension-base';
import {
  msBackgroundEmittedDataStream,
  msChangesFromBgStream,
  msSendComponentInit,
  msSendInjectScript,
  msSendPullArgsStream,
  msSendPushArgsStream,
  msSendSetTabAsIndexed,
  msSendTestStream,
  Resolvable,
  resolvablePromise,
} from '@workspace/extension-common';
import {
  SharedInPageUIState,
  SidebarContainerDependencies,
  ToolbarContainerDependencies,
} from '@workspace/extension-ui';
import browser from 'webextension-polyfill';

import {
  ContentScriptComponent,
  ContentScriptRegistry,
  SidebarScriptMain,
  ToolbarScriptMain,
} from '../types';

/**
 * Main Module for HMR && inject in webpage
 */
const csMainModule = async (
  params: {
    loadRemotely?: boolean;
    devScripts?: {
      toolbarDevModule: ToolbarScriptMain;
      sidebarDevModule: SidebarScriptMain;
    };
  } = { loadRemotely: true },
) => {
  console.log('... cs-modules/main.ts ...');

  // 1. Create a local object with promises to track each content script
  // initialisation and provide a function which can initialise a content script
  // or ignore if already loaded.
  const components: {
    toolbar?: Resolvable<void>;
    sidebar?: Resolvable<void>;
  } = {};

  // 2. Initialise dependencies required by content scripts
  const watermelonDb = await genWatermelonDb({
    dbName: 'SharedFrontendWatermelonDb2',
  });

  try {
    // reset db for pulling all from background
    await watermelonDb.write(
      async () => await watermelonDb.unsafeResetDatabase(),
    );
  } catch (error) {
    console.log('errr');
  }

  // window.addEventListener('beforeunload', async function (e) {
  //   try {
  //     // reset db for pulling all from background
  //     await watermelonDb.write(
  //       async () => await watermelonDb.unsafeResetDatabase(),
  //     );
  //   } catch (error) {
  //     console.log('errr');
  //   }
  // });

  // retrieve data from bg when called msSendSetTabAsIndexed() in the bootom
  msSendPullArgsStream.subscribe(([{ lastPulledAt }, sender]) => {
    console.log('# msSendPullArgsStream', sender.tab);
  });

  msSendPushArgsStream.subscribe(
    async ([{ changes, lastPulledAt }, sender]) => {
      console.log('#### sync ####: ', changes, lastPulledAt);
      await syncWatermelonDbFrontends({
        database: watermelonDb,
        pullBridgeFromBackground: { changes, lastPulledAt },
      });
    },
  );

  // 3. Creates an instance of the InPageUI manager class to encapsulate
  // business logic of initialising and hide/showing components.

  const inPageUI = new SharedInPageUIState({
    loadComponent: (component: ContentScriptComponent) => {
      if (!components[component]) {
        components[component] = resolvablePromise<void>();
        loadContentScript(component);
      }
      return components[component]!;
    },
    unloadComponent: (component) => {
      delete components[component];
    },
  });

  // 4. Create a contentScriptRegistry object with functions for each content script
  // component, that when run, initialise the respective component with it's
  // dependencies

  interface zz {
    toolbar: ToolbarContainerDependencies;
    sidebar: SidebarContainerDependencies;
  }
  const csDeps: zz = {
    toolbar: { inPageUI, watermelonDb },
    sidebar: { inPageUI, watermelonDb },
  };

  const contentScriptRegistry: ContentScriptRegistry = {
    async registerToolbarScript(executeToolbarScript): Promise<void> {
      await executeToolbarScript(csDeps.toolbar);
      components.toolbar?.resolve();
    },
    async registerSidebarScript(executeSidebarScript): Promise<void> {
      await executeSidebarScript(csDeps.sidebar);
      components.sidebar?.resolve();
    },
  };

  window['contentScriptRegistry'] = contentScriptRegistry;

  // 6. Setup other interactions with this page (things that always run)
  const loadContentScript = createContentScriptLoader({
    loadRemotely: params.loadRemotely,
  });

  // use es modules in development for frontend stuff
  // (chrome-extension://xxx/src/browser-shell/contentScripts/index.html)
  if (__DEV__ && window.location.href.startsWith('chrome-extension://')) {
    // webpack bundles code in production mode too, so we passed modules as parameter only in dev
    // no need inject scripts
    await params.devScripts?.toolbarDevModule(csDeps.toolbar);
    await params.devScripts?.sidebarDevModule(csDeps.toolbar);
    // await toolbarMain(csDeps.toolbar);
    // await sidebarMain(csDeps.sidebar);

    msSendComponentInit({ component: 'toolbar', scriptSender: 'main' }).then(
      () =>
        inPageUI.setComponentShouldSetup({
          component: 'toolbar',
          shouldSetUp: true,
        }),
    );
    msSendComponentInit({ component: 'sidebar', scriptSender: 'main' }).then(
      () =>
        inPageUI.setComponentShouldSetup({
          component: 'sidebar',
          shouldSetUp: true,
        }),
    );
  } else {
    // inject scripts
    await inPageUI.loadComponent('toolbar');
    await inPageUI.loadComponent('sidebar');
  }

  // msSendComponentInit({ component: "toolbar" });
  // msSendComponentInit({ component: "sidebar" });
  // debugger;
  // ///await msSendSetTabAsIndexed();
  // .then((res) => console.log('indexed', res))
  // .catch((err) => console.log('not indexed', err));

  return inPageUI;
};

export { csMainModule };

type ContentScriptLoader = (component: ContentScriptComponent) => Promise<void>;
export function createContentScriptLoader(args: { loadRemotely?: boolean }) {
  const remoteLoader: ContentScriptLoader = async (
    component: ContentScriptComponent,
  ) => {
    await msSendInjectScript({ filename: component });
  };

  const localLoader: ContentScriptLoader = async (
    component: ContentScriptComponent,
  ) => {
    const script = document.createElement('script');
    script.src = `../content_script_${component}.js`;
    document.body.appendChild(script);
  };

  return args?.loadRemotely ? remoteLoader : localLoader;
}
