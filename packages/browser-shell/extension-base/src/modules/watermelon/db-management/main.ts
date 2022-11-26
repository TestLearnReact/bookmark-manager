/* eslint-disable camelcase */
import { RawRecord } from '@nozbe/watermelondb';
import {
  Database,
  TableName,
  ModelName,
  BookmarkModel,
  TabModel,
  Collection,
  SyncDatabaseChangeSet,
  TabPositionModel,
} from '@workspace/watermelon-db';
import { bookmarks } from 'webextension-polyfill';

interface IDatabaseDefinitions2 {
  bookmarks: {
    collection: CollType<'bookmarks'>;
  };
}

interface IDatabaseDefinitions {
  [TableName.BOOKMARKS]: {
    collection: CollType<'bookmarks'>;
    // model: ModelType<'bookmarks'>;
  };
}

type TableNameType = 'bookmarks' | 'tabs' | 'tab_positions';

type CollType<T> = T extends 'bookmarks'
  ? Collection<BookmarkModel>
  : T extends 'tabs'
  ? Collection<TabModel>
  : Collection<TabPositionModel>;

type ModelType<T> = T extends 'bookmarks'
  ? BookmarkModel
  : T extends 'tabs'
  ? TabModel
  : TabPositionModel;

// type RawType<T> = T extends 'bookmarks'
//   ? BookmarkModel<RawRecord>
//   : TabModel<RawRecord>;

export class DbManagement {
  private database: Database;
  private databaseDefinitions: IDatabaseDefinitions;
  private databaseDefinitions2: IDatabaseDefinitions2;

  constructor(
    private options: {
      database: Database;
    },
  ) {
    this.database = options.database;

    this.databaseDefinitions = {
      [TableName.BOOKMARKS]: {
        collection: this.database.collections.get<BookmarkModel>(
          TableName.BOOKMARKS,
        ),
      },
    };
    this.databaseDefinitions2 = {
      bookmarks: {
        collection: this.database.collections.get<BookmarkModel>(
          TableName.BOOKMARKS,
        ),
      },
    };
  }

  getCollection<T extends TableName>(table: T) {
    const coll = this.database.collections.get(table) as CollType<T>;
    return coll;
  }

  getRawRecord<T extends TableName>({ model }: { model: ModelType<T> }) {
    return model._raw;
  }

  getRawRecordExludeFields<T extends TableName>({
    model,
    excludeFields = ['_status', '_changed'],
  }: {
    model: ModelType<T>;
    excludeFields?: string[];
  }) {
    let raw = model._raw;

    for (const key in excludeFields) {
      delete raw[excludeFields[key]];
    }

    // for (const key in raw) {
    //   console.log(raw[key]);
    // }

    return raw;
  }

  getRawRecords<T extends TableName>(models: ModelType<T>[]) {
    // const rawModels = models.reduce((pV: any, cV: any) => [...pV, cV._raw], []);
    let rawModels = [] as RawRecord[];
    models.map((model) => rawModels.push(model._raw));

    return rawModels;
  }

  getCleanedRawRecords<T extends TableName>({
    models,
    excludeFields = ['_status', '_changed'],
  }: {
    models: ModelType<T>[];
    excludeFields: string[];
  }) {
    // const rawModels = models.reduce(
    //   (pV: any, cV: any) => [
    //     ...pV,
    //     this.getRawRecordExludeFields({ model: cV, excludeFields }),
    //   ],
    //   [],
    // );
    let rawModels = [] as RawRecord[];
    models.map((model) =>
      rawModels.push(this.getRawRecordExludeFields({ model, excludeFields })),
    );

    return rawModels;
  }

  async fetchAll<T extends TableName>(table: T) {
    const fetch = await this.getCollection(table).query().fetch();
    return fetch;
  }

  async getCreated<T extends TableName>({
    table,
    shouldExcludeFields = true,
    excludeFields = ['_status', '_changed'],
  }: {
    table: T;
    shouldExcludeFields?: boolean;
    excludeFields?: string[];
  }) {
    // console.log('ff', table);
    const models = await this.fetchAll(table);

    const created = shouldExcludeFields
      ? this.getCleanedRawRecords({ models, excludeFields })
      : this.getRawRecords(models);

    return created;
  }

  async getUpated<T extends TableName>({
    table,
    shouldExcludeFields = true,
    excludeFields = ['_status', '_changed'],
  }: {
    table: T;
    shouldExcludeFields?: boolean;
    excludeFields?: string[];
  }) {
    // const models = await this.fetchAll(table);

    // const created = shouldExcludeFields
    //   ? this.getCleanedRawRecords({ models, excludeFields })
    //   : this.getRawRecords(models);

    return [] as RawRecord[];
  }

  async getDeleted<T extends TableName>({
    table,
    shouldExcludeFields = true,
    excludeFields = ['_status', '_changed'],
  }: {
    table: T;
    shouldExcludeFields?: boolean;
    excludeFields?: string[];
  }) {
    // const models = await this.fetchAll(table);

    // const created = shouldExcludeFields
    //   ? this.getCleanedRawRecords({ models, excludeFields })
    //   : this.getRawRecords(models);

    return [] as string[];
  }

  async getChanges<T extends TableName>({
    tables = ['bookmarks', 'tabs', 'tab_positions'], // todo
    shouldExcludeFields = true,
    excludeFields = ['_status', '_changed'],
  }: {
    tables?: string[];
    shouldExcludeFields?: boolean;
    excludeFields?: string[];
  }) {
    let changes = Object.create(null, {}) as SyncDatabaseChangeSet;
    tables.map((t) => (changes[t] = { created: [], updated: [], deleted: [] }));

    // tables.map(
    //   async (t) =>
    //     (changes[t] = {
    //       created: await this.getCreated({
    //         table: TableName[t.toUpperCase()],
    //         shouldExcludeFields,
    //         excludeFields,
    //       }),
    //       updated: await this.getUpated({
    //         table: TableName[t.toUpperCase()],
    //         shouldExcludeFields,
    //         excludeFields,
    //       }),
    //       deleted: await this.getDeleted({
    //         table: TableName[t.toUpperCase()],
    //         shouldExcludeFields,
    //         excludeFields,
    //       }),
    //     }),
    // );

    tables.map(async (table) => {
      const created = await this.getCreated({
        table: TableName[table.toUpperCase()],
        shouldExcludeFields,
        excludeFields,
      });
      const updated = await this.getUpated({
        table: TableName[table.toUpperCase()],
        shouldExcludeFields,
        excludeFields,
      });
      const deleted = await this.getDeleted({
        table: TableName[table.toUpperCase()],
        shouldExcludeFields,
        excludeFields,
      });

      changes[table] = {
        created: created,
        updated: updated,
        deleted: deleted,
      };

      // changes[table] = {
      //   created: await this.getCreated({
      //     table: TableName[table.toUpperCase()],
      //     shouldExcludeFields,
      //     excludeFields,
      //   }),
      //   updated: await this.getUpated({
      //     table: TableName[table.toUpperCase()],
      //     shouldExcludeFields,
      //     excludeFields,
      //   }),
      //   deleted: await this.getDeleted({
      //     table: TableName[table.toUpperCase()],
      //     shouldExcludeFields,
      //     excludeFields,
      //   }),
      // };
    });

    return changes;
  }

  async getChanges2<T extends TableName>({
    tables = ['bookmarks', 'tabs', 'tab_positions'], // todo
    shouldExcludeFields = true,
    excludeFields = ['_status', '_changed'],
  }: {
    tables?: string[];
    shouldExcludeFields?: boolean;
    excludeFields?: string[];
  }) {
    if (tables.includes(TableName.BOOKMARKS)) {
      console.log(' :::: ', tables['bookmarks']);
    } else {
      console.log(' :?::?: ', tables['bookmarks']);
    }

    let changes = {
      bookmarks: {
        created: tables.includes(TableName.BOOKMARKS)
          ? await this.getCreated({
              table: TableName.BOOKMARKS,
              shouldExcludeFields,
              excludeFields,
            })
          : [],
        updated: [],
        deleted: [],
      },
      tabs: {
        created: tables.includes(TableName.TABS)
          ? await this.getCreated({
              table: TableName.TABS,
              shouldExcludeFields,
              excludeFields,
            })
          : [],
        updated: [],
        deleted: [],
      },
      tab_positions: {
        created: tables.includes(TableName.TAB_POSITIONS)
          ? await this.getCreated({
              table: TableName.TAB_POSITIONS,
              shouldExcludeFields,
              excludeFields,
            })
          : [],
        updated: [],
        deleted: [],
      },
    };

    console.log('###', changes);
    return changes;
  }

  excludeFields({
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

  // changes: {
  //   bookmarks: { created: rawBokkmarks, updated: [], deleted: [] },
  // },
}

// getItems<T extends TableNameType>(type: T) {
//   const coll = this.database.collections.get(type) as CollType<T>;
//   const coll2 = this.database.collections.get(type);

//   return coll;
// }

// async xxx() {
//   const z = this.getItems('bookmarks');
//   const zz = await (await z.find('')).createBookmark;
//   const c = await this.getCollection(TableName.BOOKMARKS);
//   const cc = await (await c.find('')).createBookmark;
//   const d = await this.getCollection2(TableName.BOOKMARKS);
//   const dd = await (await c.find('')).createBookmark;
//   const b = await this.getCollectionB();
//   const bb = (await b.find('')).createBookmark;
// }

// getCollection<T extends TableName>(table: T) {
//   const coll = this.database.collections.get(table) as CollType<T>;
//   const coll2 = this.databaseDefinitions[TableName.BOOKMARKS].collection;
//   const coll3 = this.databaseDefinitions2['bookmarks'].collection;
//   return coll;
// }

// getCollection2<T extends TableNameType>(table: T) {
//   const coll2 = this.databaseDefinitions[table as TableNameType]
//     .collection as CollType<T>;
//   const coll3 = this.databaseDefinitions2[table as TableNameType]
//     .collection as CollType<T>;
//   return coll2;
// }

// getCollectionB() {
//   const coll = this.database.collections.get<BookmarkModel>('bookmarks');
//   return coll;
// }
