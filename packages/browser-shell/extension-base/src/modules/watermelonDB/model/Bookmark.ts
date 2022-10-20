import { Model, Q } from '@nozbe/watermelondb';
import { field, text, writer } from '@nozbe/watermelondb/decorators';
import { TableName } from '../types';

export interface IBookmarkCollection {
  url: string;
  normalizedUrl: string;
  title: string;
}

export class BookmarkModel extends Model {
  static table = TableName.BOOKMARKS;

  @field('url') url!: string;
  @field('normalized_url') normalizedUrl!: string;
  @text('title') title!: string;

  @writer async createBookmark({
    url,
    normalizedUrl,
    title,
  }: Pick<BookmarkModel, 'url' | 'normalizedUrl' | 'title'>) {
    const newBookmark = await this.collections
      .get<BookmarkModel>(TableName.BOOKMARKS)
      .create((bookmark) => {
        bookmark.url = url;
        normalizedUrl;
        title;
      });
    return newBookmark;
  }

  @writer async deleteBookmark({ url }: Pick<BookmarkModel, 'url'>) {
    const bookmark = await this.collections
      .get<BookmarkModel>(TableName.BOOKMARKS)
      .find(url);

    return bookmark.markAsDeleted();
  }

  async getBookmarkById({ id }: Pick<BookmarkModel, 'id'>) {
    const bookmark = await this.collections
      .get<BookmarkModel>(TableName.BOOKMARKS)
      .find(id);

    return bookmark;
  }

  async getBookmarkByUrl({ url }: Pick<BookmarkModel, 'url'>) {
    const bookmarks = await this.collections
      .get<BookmarkModel>(TableName.BOOKMARKS)
      .query(Q.where('url', url))
      .fetch();

    return bookmarks[0];
  }
}
