import getMessage from '@workspace/message-system';
import { SyncPullArgs, SyncPushArgs } from '@nozbe/watermelondb/sync';
import { ContentScriptComponent, InPageUIComponentShowState } from '../types';
import browser from 'webextension-polyfill';
import { type } from 'os';

/** extension messages */
export const [msSendInjectScript, msInjectScriptStream, msWaitForInjectScript] =
  getMessage<{ filename: ContentScriptComponent }>('INJECT_SCRIPT');

export const [
  msSendComponentInit,
  msComponentInitStream,
  msWaitForComponentInit,
] = getMessage<{
  component: ContentScriptComponent;
  scriptSender: ContentScriptComponent;
}>('COMPONENT_INIT');

export const [
  msSendComponentDestroy,
  msComponentDestroyStream,
  msWaitForComponentDestroy,
] = getMessage<{ component: ContentScriptComponent }>('COMPONENT_DESTROY');

/**
 *
 */
export const [
  msSendInPageUiState,
  msInPageUiStateStream,
  msWaitForInPageUiStateStream,
] = getMessage<InPageUIComponentShowState & { theme?: 'dark' | 'light' }>(
  'INPAGE_UI_STATE',
);

export const [
  msSendSharedStateSettings,
  msSharedStateSettingsStream,
  msWaitForSharedStateSettings,
] = getMessage<{ theme: 'dark' | 'light' }>('SHARED_STATE_SETTINGS');

export const [
  msSendBackgroundEmittedData,
  msBackgroundEmittedDataStream,
  msWaitForBackgroundEmittedData,
] = getMessage<{
  onUpdated: {
    tabId: number;
    changeInfo: browser.Tabs.OnUpdatedChangeInfoType;
    tabinfo: browser.Tabs.Tab;
  };
}>('INDEX');

export const [
  msSendSetTabAsIndexed,
  msSetTabAsIndexedStream,
  msWaitForSetTabAsIndexed,
] = getMessage<void>('TAB_INDEXED');
/**
 * sync WatermelonDB
 *  */
export const [msSendTest, msSendTestStream, msWaitForSendTest] =
  getMessage<any>('TEST');

export const [msSendPushArgs, msSendPushArgsStream, msWaitForSendPushArgs] =
  getMessage<SyncPushArgs>('SYNC_PUSH');

export const [msSendPullArgs, msSendPullArgsStream, msWaitForSendPullArgs] =
  getMessage<SyncPullArgs>('SYNC_PULL');

type CreateTab = '';

interface ICallFunction {
  createTab?: {
    args: { apiTabId: number; isActive: boolean; isOpen: boolean };
  };
  updateTab?: {
    args: { apiTabId: number; isActive: boolean; isOpen: boolean };
  };
}
export const [
  msSendChangesFromBg,
  msChangesFromBgStream,
  msWaitForChangesFromBg,
] = getMessage<ICallFunction>('SEND_CHAGES_FROM_BG');

/**
 * development
 *  */
export const [
  msSendExtensionReload,
  msExtensionReloadStream,
  msWaitForExtensionReload,
] = getMessage<void>('EXTENSION_RELOAD');
