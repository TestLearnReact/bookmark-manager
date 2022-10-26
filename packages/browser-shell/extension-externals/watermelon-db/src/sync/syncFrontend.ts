import {
  synchronize,
  type SyncPullArgs,
  type SyncPushArgs,
  type SyncPullResult,
} from '@nozbe/watermelondb/sync';
import { Database } from '@nozbe/watermelondb';
import { msSendPushArgs } from '@workspace/extension-common';
import { date } from '@nozbe/watermelondb/decorators';

// export { SyncPullArgs, SyncPushArgs };

export async function mySync({
  database,
  pullBridgeFromBackground = { changes: {}, lastPulledAt: Date.now() },
}: {
  database: Database;
  pullBridgeFromBackground?: SyncPushArgs;
}) {
  const { changes: synyChanges, lastPulledAt: syncTimestamp } =
    pullBridgeFromBackground;

  await synchronize({
    database,
    pullChanges: async ({ lastPulledAt, schemaVersion, migration }) => {
      console.log('sync pull frontend', pullBridgeFromBackground);
      return {
        changes: synyChanges,
        timestamp: syncTimestamp,
      };
    },
    pushChanges: async ({ changes, lastPulledAt }) => {
      console.log('sync push frontend', changes);
      msSendPushArgs({ changes, lastPulledAt });
    },
    migrationsEnabledAtVersion: 1,
  });
}
