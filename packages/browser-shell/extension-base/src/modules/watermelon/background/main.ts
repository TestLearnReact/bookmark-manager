import {
  msSendPushArgs,
  msSendPushArgsStream,
} from '@workspace/extension-common';
import Browser, { Runtime } from 'webextension-polyfill';

import { Database, synchronize, SyncPushArgs } from '@workspace/watermelon-db';
import { TabManagementBackground } from '../../tab-management';
import { DbManagement } from '../db-management';

// import {
//   DbManagement,
//   TabManagementBackground,
// } from '@workspace/extension-base/modules';

export class WatermelonDbBackground {
  private runtimeAPI: Runtime.Static;
  private database: Database;
  private tabManagementBackground: TabManagementBackground;
  private dbManagement: DbManagement;

  constructor({
    runtimeAPI = Browser.runtime,
    database,
    tabManagementBackground,
  }: {
    runtimeAPI?: Runtime.Static;
    database: Database;
    tabManagementBackground: TabManagementBackground;
  }) {
    this.runtimeAPI = runtimeAPI;
    this.database = database;
    this.tabManagementBackground = tabManagementBackground;
    this.dbManagement = new DbManagement({ database: this.database });

    // only called from cs (background msSendPushArgs calls only send to tabs)
    msSendPushArgsStream.subscribe(
      async ([{ changes, lastPulledAt }, sender]) => {
        // delete fields ['_status', '_changed'] in raw record
        const cleanedChanges = this.dbManagement.excludeFields({ changes });

        // save changes from frontend db in background db
        const res = await this.handleSync({
          push: { changes: cleanedChanges, lastPulledAt },
        });

        // send changes to all open tabs where cs is injected an is not active
        this.tabManagementBackground._tabsToSync.forEach(async (value, key) => {
          console.log('# not: ', value, key);
          if (!value.isActive && value.isCsInjected && value.isOpen) {
            console.log('# yes: ', value, key);
            await msSendPushArgs(
              {
                changes: res.changes,
                lastPulledAt: res.timestamp,
              },
              { tabId: key },
            );
          }
        });
      },
    );
  }

  private async handleSync({ push }: { push: SyncPushArgs }) {
    /**
     * get data from frontend
     * inject changes via pullChanges from frontend pushChanges
     */
    await synchronize({
      database: this.database,

      pullChanges: async ({ lastPulledAt, schemaVersion, migration }) => {
        console.log(
          '### WatermelonDbBackground pullChanges:',
          push.changes,
          lastPulledAt,
        );
        return { changes: push.changes, timestamp: push.lastPulledAt };
      },
      pushChanges: async ({ changes, lastPulledAt }) => {
        //
      },
      migrationsEnabledAtVersion: 1,
    });

    /**
     *  return changes to sync Watermelondb with other Tabs
     */

    return { changes: push.changes, timestamp: push.lastPulledAt };
  }
}
