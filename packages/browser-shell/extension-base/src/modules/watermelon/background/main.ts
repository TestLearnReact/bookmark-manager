import {
  SyncPushArgs,
  SyncPullArgs,
  synchronize,
  SyncDatabaseChangeSet,
} from '@nozbe/watermelondb/sync';
import { Database } from '@nozbe/watermelondb';
import {
  msSendPullArgs,
  msSendPushArgs,
  msSendPushArgsStream,
} from '@workspace/extension-common';
import Browser, { Runtime } from 'webextension-polyfill';

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
        const res = await this.handleSync({ push: { changes, lastPulledAt } });
        await msSendPushArgs(
          {
            changes: res.changes,
            lastPulledAt: res.timestamp,
          },
          { tabId: sender.tab?.id },
        );
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
     *
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
     *  sync Watermelondb with other
     */

    return { changes: cleandedChanges, timestamp: push.lastPulledAt };
  }

  private async handleUpdateLogic(now = Date.now()) {
    console.log('- Update Logic -', now);
  }
}
