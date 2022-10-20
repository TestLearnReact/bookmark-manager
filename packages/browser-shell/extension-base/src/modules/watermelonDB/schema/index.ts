import { appSchema, tableSchema } from '@nozbe/watermelondb';
import { TableName } from '../types';

export const schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'posts',
      columns: [
        { name: 'title', type: 'string' },
        { name: 'subtitle', type: 'string', isOptional: true },
        { name: 'body', type: 'string' },
        { name: 'is_pinned', type: 'boolean' },
        { name: 'last_seen_at', type: 'number', isOptional: true },
        { name: 'archived_at', type: 'number', isOptional: true },
      ],
    }),
    tableSchema({
      name: 'comments',
      columns: [
        { name: 'body', type: 'string' },
        { name: 'post_id', type: 'string', isIndexed: true },
        { name: 'is_pinned', type: 'boolean' },
      ],
    }),
    tableSchema({
      name: TableName.BOOKMARKS,
      columns: [
        { name: 'url', type: 'string', isIndexed: true },
        { name: 'normalized_url', type: 'string', isIndexed: true },
        { name: 'title', type: 'string' },
      ],
    }),
  ],
});
