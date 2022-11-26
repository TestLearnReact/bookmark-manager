import { Model, Q } from '@nozbe/watermelondb';
import {
  date,
  field,
  immutableRelation,
  readonly,
  relation,
  text,
  writer,
} from '@nozbe/watermelondb/decorators';
import { Associations } from '@nozbe/watermelondb/Model';
import { TableName } from '../types';

// export interface ITabHistoryCollection {
//   url: string;
//   normalizedUrl: string;
//   title: string;
//   isActive: boolean;
// }

export class TabPositionModel extends Model {
  static table = TableName.TAB_POSITIONS;

  static associations: Associations = {
    [TableName.TABS]: { type: 'belongs_to', key: 'tab_id' },
  };

  @immutableRelation(TableName.TABS, 'tab_id') tab;

  @field('api_tab_id') apiTabId!: string;
  @field('url') url!: string;
  @text('title') title!: string;
  @readonly @date('created_at') createdAt;
  @readonly @date('updated_at') updatedAt;

  @writer async updateTab({
    apiTabId,
    url,
    title,
  }: Pick<TabPositionModel, 'apiTabId' | 'url' | 'title'>) {
    await this.update((tab) => {
      tab.apiTabId = apiTabId;
      tab.url = url;
      tab.title = title;
    });
  }

  @writer async updateUrl({ url }: Pick<TabPositionModel, 'url'>) {
    await this.update((tab) => {
      tab.url = url;
    });
  }

  @writer async updateTitle({ title }: Pick<TabPositionModel, 'title'>) {
    await this.update((tab) => {
      tab.title = title;
    });
  }

  //   @writer async deleteTabById({ id }: { id: string }) {
  //     const tab = await this.collections.get<TabHistoryModel>(TableName.TABHISTORIES).find(id);

  //     return tab.markAsDeleted();
  //   }
}
