import { Database, Q } from '@nozbe/watermelondb';
import { type BookmarkModel } from '../model';
import { TableName } from '../types';

export async function isBookmarked({
  database,
  url,
}: {
  database: Database;
  url: string;
}) {
  const bookmarks = await database.collections
    .get<BookmarkModel>(TableName.BOOKMARKS)
    .query(Q.where('url', url))
    .fetch();

  return Array.isArray(bookmarks) && bookmarks.length > 0;
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

export const deleteBookmarkById = async ({
  database,
  id,
}: {
  database: Database;
  id: string;
}) => {
  const bookmark = await database.collections
    .get<BookmarkModel>(TableName.BOOKMARKS)
    .find(id);

  await database.write(async (writer) => {
    const delBookmark = bookmark.markAsDeleted();
    return delBookmark;
  });

  return;
};
