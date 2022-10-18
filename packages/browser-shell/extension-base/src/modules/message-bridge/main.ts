import {
  msComponentInitStream,
  msSendComponentInit,
  msInPageUiStateStream,
  msSendInPageUiState,
  msComponentDestroyStream,
  msSendComponentDestroy,
  msSharedStateSettingsStream,
  msSendSharedStateSettings,
} from '@workspace/extension-common';

/**
 * message bridge between content scripts
 */

export const messageBridgeCsBgCs = () => {
  msComponentInitStream.subscribe(async ([{ component }, sender]) => {
    await msSendComponentInit({ component }, { tabId: sender.tab?.id });
  });

  msComponentDestroyStream.subscribe(async ([{ component }, sender]) => {
    await msSendComponentDestroy({ component }, { tabId: sender.tab?.id });
  });

  msInPageUiStateStream.subscribe(async ([{ toolbar, sidebar }, sender]) => {
    await msSendInPageUiState({ toolbar, sidebar }, { tabId: sender.tab?.id });
  });

  msSharedStateSettingsStream.subscribe(async ([{ theme }, sender]) => {
    await msSendSharedStateSettings({ theme }, { tabId: sender.tab?.id });
  });
};
