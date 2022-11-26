import { Database, Q } from '@nozbe/watermelondb';
import { TabModel, TabPositionModel } from '../model';
import { TableName } from '../types';

export const createTab = async ({
  database,
  fields,
}: {
  database: Database;
  fields: Pick<TabModel, 'apiTabId' | 'isActive' | 'isOpen'>;
}) => {
  const { apiTabId, isActive, isOpen } = fields;

  const returnTab = await database.write(async (writer) => {
    const tab = await database.collections
      .get<TabModel>(TableName.TABS)
      .create((t) => {
        t.apiTabId = apiTabId;
        t.isActive = isActive;
        t.isOpen = isOpen;
      });
    return tab;
  });

  return returnTab;
};

export const handleToggleIsActive = async ({
  database,
  toggleArr,
  actTabId,
}: {
  database: Database;
  toggleArr: TabModel[];
  actTabId: number;
}) => {
  let toToggle = [] as TabModel[];

  if (toggleArr.length > 0) {
    toggleArr.map(async (tab) => {
      if (tab.isActive || tab.apiTabId === actTabId.toString()) {
        toToggle.push(tab);
      }
    });

    if (toToggle.length > 0) {
      database.write(async (writer) => {
        toToggle.map(async (tab) => {
          tab.prepareUpdate((t) => {
            t.isActive = !tab.isActive;
          });
        });

        await database.batch(...toToggle);
      });
    }
  }
};

export const handleIsOpen = async ({
  database,
  actTabId,
}: {
  database: Database;
  actTabId: number;
}) => {
  const tabs = await database.collections
    .get<TabModel>(TableName.TABS)
    .query(Q.where('api_tab_id', actTabId.toString()))
    .fetch();

  if (Array.isArray(tabs) && tabs.length > 0) {
    await tabs[0].updateIsOpen({ isOpen: false });
  }

  return tabs;
};

export const createTabPos = async ({
  database,
  fields,
}: {
  database: Database;
  fields: Pick<TabPositionModel, 'apiTabId' | 'url' | 'title'>;
}) => {
  const { apiTabId, url, title } = fields;

  const returnTab = await database.write(async (writer) => {
    const tab = await database.collections
      .get<TabPositionModel>(TableName.TAB_POSITIONS)
      .create((t) => {
        t.apiTabId = apiTabId;
        t.url = url;
        t.title = title;
      });
    return tab;
  });

  return returnTab;
};

// export async function isTabIndexed({
//   database,
//   id,
// }: {
//   database: Database;
//   id: string;
// }) {
//   const tabs = await database.collections
//     .get<TabModel>(TableName.TABS)
//     .query(Q.where('id', id))
//     .fetch();

//   return Array.isArray(tabs) && tabs.length > 0;
// }

// export const createTab = async ({
//   database,
//   fields,
// }: {
//   database: Database;
//   fields: Pick<TabModel, 'url' | 'title' | 'isActive'> & { id: string };
// }) => {
//   const { id, url, title, isActive } = fields;

//   const returnTab = await database.write(async (writer) => {
//     const tab = await database.collections
//       .get<TabModel>(TableName.TABS)
//       .create((t) => {
//         t._raw.id = id;
//         t.url = url;
//         t.title = title;
//         t.isActive = isActive;
//       });
//     return tab;
//   });

//   return returnTab;
// };

// // export const findTabById = async ({
// //   database,
// //   id,
// // }: {
// //   database: Database;
// //   id: string; // Pick<TabModel, 'tab_id'>;
// // }) => {
// //   let tab = {} as TabModel;

// //   try {
// //     tab = await database.collections
// //       .get<TabModel>(TableName.TABS)
// //       .find(id)
// //       .then((r) => {
// //         console.log('!!!FIND', r);
// //         return r;
// //       })
// //       .catch((r) => console.log('!!!CATCH', r));
// //   } catch (error) {
// //     //
// //   }

// //   return tab;
// // };

// export const isTab = async ({
//   database,
//   id,
// }: {
//   database: Database;
//   id: string; // Pick<TabModel, 'tab_id'>;
// }) => {
//   let exist = false;

//   try {
//     await database.collections
//       .get<TabModel>(TableName.TABS)
//       .find(id)
//       .then(() => (exist = true));
//   } catch (error) {
//     //
//   }

//   return exist;
// };

// // export const createTabIfNeeded = async ({
// //   database,
// //   fields,
// // }: {
// //   database: Database;
// //   fields: Pick<TabModel, 'url' | 'title' | 'isActive'> & { id: string };
// // }) => {
// //   const { id, url, title, isActive } = fields;

// //   let tab = await findTabById({ database, id });

// //   try {
// //     if (tab._raw.id === '') {
// //       tab = await createTab({ database, fields: { id, url, title, isActive } });
// //     }
// //   } catch (error) {
// //     //
// //   }

// //   return tab;
// // };

// export const createOrUpdateTab = async ({
//   database,
//   fields,
// }: {
//   database: Database;
//   fields: Pick<TabModel, 'bTabId' | 'url' | 'title' | 'isActive'>;
// }) => {
//   const { bTabId, url, title, isActive } = fields;

//   const tabs = await database.collections
//     .get<TabModel>(TableName.TABS)
//     .query(Q.where('b_tab_id', bTabId))
//     .fetch();

//   return Array.isArray(tabs) && tabs.length > 0;

//   // let findTab;
//   // try {
//   //   findTab = await database.collections.get<TabModel>(TableName.TABS).find(id);
//   // } catch (error) {
//   //   //
//   // }

//   // try {
//   //   await findTab.update((t) => {
//   //     t.url = url;
//   //     t.title = title;
//   //     t.isActive = isActive;
//   //   });

//   //   console.log('TTT', findTab);
//   // } catch (error) {
//   //   findTab = await createTab({ database, fields });
//   //   console.log('CCC', findTab);
//   // }

//   // return findTab;
// };

// // export const deleteTab = async ({
// //   database,
// //   id,
// // }: {
// //   database: Database;
// //   id: string;
// // }) => {
// //   let tab = {} as TabModel;
// //   let tabExist = true;

// //   try {
// //     tab = await findTabById({ database, id });
// //     tab.markAsDeleted();
// //   } catch (error) {
// //     tabExist = false;
// //   }

// //   return tab;
// // };
