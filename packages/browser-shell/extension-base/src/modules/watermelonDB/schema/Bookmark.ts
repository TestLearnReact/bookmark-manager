import { tableSchema } from '@nozbe/watermelondb';
import { TableName } from '../types';

const BookmarkTableSchema = tableSchema({
  name: TableName.BOOKMARKS,
  columns: [
    { name: 'url', type: 'string', isIndexed: true },
    { name: 'normalized_url', type: 'string', isIndexed: true },
    { name: 'title', type: 'string' },
  ],
});

export { BookmarkTableSchema };
