import { Database, Q } from '@nozbe/watermelondb';
import { type BookmarkModel } from '../model';
import { TableName } from '../types';
// import { Database, Q } from '../watermelonFuncsAndTypes';

export async function isBookmarked({
  database,
  url,
}: {
  database: Database;
  url: string;
}) {
  console.log('...+#.', url, ' ?? ', Q.sanitizeLikeString(url));

  const find = await database.collections
    .get<BookmarkModel>(TableName.BOOKMARKS)
    .query(Q.where('url', Q.like(`%${url}%`)))
    .fetch();

  return find;
}

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
