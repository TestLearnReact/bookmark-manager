import { appSchema, tableSchema } from '@nozbe/watermelondb';
import { TableName } from '../types';

import { Tabs } from 'webextension-polyfill';

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
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'comments',
      columns: [
        { name: 'body', type: 'string' },
        { name: 'post_id', type: 'string', isIndexed: true },
        { name: 'is_pinned', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: TableName.BOOKMARKS,
      columns: [
        { name: 'url', type: 'string', isIndexed: true },
        { name: 'normalized_url', type: 'string', isIndexed: true },
        { name: 'title', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: TableName.TABS,
      columns: [
        { name: 'api_tab_id', type: 'string', isIndexed: true },
        { name: 'is_active', type: 'boolean' },
        { name: 'is_open', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: TableName.TAB_POSITIONS,
      columns: [
        { name: 'api_tab_id', type: 'string', isIndexed: true },
        { name: 'url', type: 'string', isIndexed: true },
        { name: 'title', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: TableName.USER_SETTINGS,
      columns: [
        { name: 'theme_type', type: 'string', isIndexed: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
  ],
});

// const test: Tabs.Tab;
