import { Database, Q } from '@nozbe/watermelondb';
import { type BookmarkModel } from '../model';
import { TableName } from '../types';
// import { Database, Q } from '../watermelonFuncsAndTypes';

export const isBookmarked = async ({
  database,
  url,
}: {
  database: Database;
  url: string;
}) => {
  console.log('...+#####.', url);

  const find = await database
    .get<BookmarkModel>(TableName.BOOKMARKS)
    .query(Q.where('url', url.toString()))
    .fetch();

  return find;
};

export const createBookmark = async ({
  database,
  fields,
}: {
  database: Database;
  fields: Pick<BookmarkModel, 'url' | 'normalizedUrl' | 'title'>;
}) => {
  const { url, normalizedUrl, title } = fields;

  console.log('???', url, normalizedUrl, title);

  const bookmark = await database.write(async (writer) => {
    const bookmark = await database.collections
      .get<BookmarkModel>(TableName.BOOKMARKS)
      .create((b) => {
        // url;
        // normalizedUrl;
        // title;
        b.url = url;
        b.normalizedUrl = normalizedUrl;
        b.title = title;
      });
    return bookmark;
  });

  return bookmark;
};

export const deleteBookmarkByUrl = async ({
  database,
  url,
}: {
  database: Database;
  url: string;
}) => {
  await database.write(async (writer) => {
    const delBookmark = database.collections
      .get<BookmarkModel>(TableName.BOOKMARKS)
      .query(Q.where('url', url))
      .markAllAsDeleted();

    return delBookmark;
  });

  return;
};

// await database.write(async (writer) => {
//   const del = await database.collections
//     .get<BookmarkModel>(TableName.BOOKMARKS)
//     .query(Q.where('url', window.location.href))
//     .markAllAsDeleted();

//   return del;
// });
