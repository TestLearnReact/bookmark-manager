// import {
//     synchronize,
//     type SyncPushArgs,
//   } from '@nozbe/watermelondb/sync';
import {
  Database,
  SyncDatabaseChangeSet,
  synchronize,
  SyncPushArgs,
} from '@workspace/watermelon-db';
import { msSendPushArgs } from '@workspace/extension-common';

function excludeFields({
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

export async function syncWatermelonDbFrontends({
  database,
  pullBridgeFromBackground = { changes: {}, lastPulledAt: Date.now() },
  sendToTabIds = [],
}: {
  database: Database;
  pullBridgeFromBackground?: SyncPushArgs;
  sendToTabIds?: number[];
}) {
  const { changes: synyChanges, lastPulledAt: syncTimestamp } =
    pullBridgeFromBackground;

  await synchronize({
    database,
    pullChanges: async ({ lastPulledAt, schemaVersion, migration }) => {
      const cleanedChanges = excludeFields({ changes: synyChanges });

      console.log(
        '..sync pull frontend',
        pullBridgeFromBackground,
        cleanedChanges,
      );

      return {
        changes: cleanedChanges,
        timestamp: syncTimestamp,
      };
    },
    pushChanges: async ({ changes, lastPulledAt }) => {
      console.log('..sync push frontend', changes);

      const cleanedChanges = changes; // excludeFields({ changes });
      try {
        // changes from background database -> send to tabs
        if (sendToTabIds.length > 0) {
          sendToTabIds?.map(
            async (id) =>
              await msSendPushArgs(
                { changes: cleanedChanges, lastPulledAt },
                { tabId: id },
              ),
          );
        } else {
          // changes from frontend db -> sync all non active tabs
          msSendPushArgs({ changes: cleanedChanges, lastPulledAt: Date.now() });
        }
      } catch (error) {
        //
      }
    },
    migrationsEnabledAtVersion: 1,
  });
}
