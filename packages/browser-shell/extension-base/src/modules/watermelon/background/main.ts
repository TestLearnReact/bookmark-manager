// import {
//   SyncPushArgs,
//   SyncPullArgs,
//   synchronize,
//   SyncDatabaseChangeSet,
// } from '@nozbe/watermelondb/sync';
import {
  msSendPullArgs,
  msSendPushArgs,
  msSendPushArgsStream,
} from '@workspace/extension-common';
import Browser, { Runtime } from 'webextension-polyfill';
import { TableName, TabModel } from '../database';

import {
  Database,
  synchronize,
  SyncPushArgs,
  SyncDatabaseChangeSet,
  Q,
} from '@workspace/watermelon-db';

export class WatermelonDbBackground {
  private runtimeAPI: Runtime.Static;
  private database: Database;

  constructor({
    runtimeAPI = Browser.runtime,
    database,
  }: {
    runtimeAPI?: Runtime.Static;
    database: Database;
  }) {
    this.runtimeAPI = runtimeAPI;
    this.database = database;

    msSendPushArgsStream.subscribe(
      async ([{ changes, lastPulledAt }, sender]) => {
        console.log('sync sync sync ');
        const res = await this.handleSync({ push: { changes, lastPulledAt } });

        const ii = sender.tab?.id;
        if (ii) {
          const atab = await database.collections
            .get<TabModel>(TableName.TABS)
            .query(
              Q.and(
                Q.where('api_tab_id', Q.notEq(ii)),
                Q.where('is_open', Q.eq(true)),
              ),
            )
            .fetch();
          console.log('......', ii, atab);

          atab.map((tab) => {
            // send changes to other Tabs -> insert via pullChanges
            console.log('ä', tab.id, tab);
            msSendPushArgs(
              {
                changes: res.changes,
                lastPulledAt: res.timestamp,
              },
              { tabId: Number(tab.apiTabId) },
            );
          });
        }
      },
    );
  }

  private excludeFields({
    changes,
    excludeFields = ['_status', '_changed'],
  }: {
    changes: SyncDatabaseChangeSet;
    excludeFields?: string[];
  }) {
    const defaultExcluded = excludeFields;
    const cleanedChanges = changes;

    for (const key in cleanedChanges) {
      const ii = cleanedChanges[key];
      for (const key in ii) {
        const createdUpdatedDeletedArr = ii[key];
        createdUpdatedDeletedArr.map((rec) => {
          defaultExcluded.map((field) => {
            delete rec[field];
          });
        });
      }
    }

    return cleanedChanges;
  }

  private async handleSync({ push }: { push: SyncPushArgs }) {
    const cleandedChanges = this.excludeFields({ changes: push.changes });

    /**
     * get data from frontend
     */
    await synchronize({
      database: this.database,

      pullChanges: async ({ lastPulledAt, schemaVersion, migration }) => {
        console.log('pullChanges:', cleandedChanges, lastPulledAt);
        return { changes: cleandedChanges, timestamp: push.lastPulledAt };
      },
      pushChanges: async ({ changes, lastPulledAt }) => {
        //
      },
      migrationsEnabledAtVersion: 1,
    });

    /**
     *  return changes to sync Watermelondb with other Tabs
     */

    return { changes: cleandedChanges, timestamp: push.lastPulledAt };
  }

  private async handleUpdateLogic(now = Date.now()) {
    console.log('- Update Logic -', now);
  }
}
