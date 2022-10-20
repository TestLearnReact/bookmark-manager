import withObservables, {
  ExtractedObservables,
  ObservableifyProps,
} from '@nozbe/with-observables';

import { type Database, Q, type Query } from '@nozbe/watermelondb';

import DatabaseProvider, {
  withDatabase,
} from '@nozbe/watermelondb/DatabaseProvider';

import { useDatabase } from '@nozbe/watermelondb/hooks';

export {
  Query,
  Q,
  withObservables,
  DatabaseProvider,
  withDatabase,
  useDatabase,
  type ExtractedObservables,
  type ObservableifyProps,
  Database,
};
