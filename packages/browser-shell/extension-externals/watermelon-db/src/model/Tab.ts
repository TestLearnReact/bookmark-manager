import { Model, Q } from '@nozbe/watermelondb';
import {
  children,
  date,
  field,
  readonly,
  text,
  writer,
} from '@nozbe/watermelondb/decorators';
import { Associations } from '@nozbe/watermelondb/Model';
import { TableName } from '../types';
import { TabPositionModel } from './TabPosition';

export interface ITabCollection {
  url: string;
  normalizedUrl: string;
  title: string;
  isActive: boolean;
}

export class TabModel extends Model {
  static table = TableName.TABS;

  static associations: Associations = {
    [TableName.TABPOSITIONS]: { type: 'has_many', foreignKey: 'tab_id' },
  };

  @children(TableName.TABPOSITIONS) tabPositions;

  @field('api_tab_id') apiTabId!: string;
  @field('is_active') isActive!: boolean;
  @field('is_open') isOpen!: boolean;
  @readonly @date('created_at') createdAt;
  @readonly @date('updated_at') updatedAt;

  @writer async addTabPosition({
    url,
    title,
  }: Pick<TabPositionModel, 'url' | 'title'>) {
    const newPosition = await this.collections
      .get<TabPositionModel>(TableName.TABPOSITIONS)
      .create((pos) => {
        pos.tab.set(this);
        pos.url = url;
        pos.title = title;
      });
    return newPosition;
  }

  @writer async createTab({
    apiTabId,
    isActive,
    isOpen,
  }: Pick<TabModel, 'apiTabId' | 'isActive' | 'isOpen'>) {
    const newTab = await this.collections
      .get<TabModel>(TableName.TABS)
      .create((tab) => {
        tab.apiTabId = apiTabId;
        tab.isActive = isActive;
        tab.isOpen = isOpen;
      });
    return newTab;
  }

  @writer async markAsActive() {
    await this.update((tab) => {
      tab.isActive = true;
    });
  }

  @writer async toggleIsActive() {
    this.update((tab) => {
      tab.isActive = !tab.isActive;
    });
  }

  @writer async toggleIsActiveArr(arr: TabModel[]) {
    if (arr.length > 0) {
      arr.map((tab: TabModel) =>
        tab.prepareUpdate((t) => {
          t.isActive = !tab.isActive;
        }),
      );
      await this.batch();
    }
  }

  @writer async updateTab({
    apiTabId,
    isActive,
    isOpen,
  }: Pick<TabModel, 'apiTabId' | 'isActive' | 'isOpen'>) {
    await this.update((tab) => {
      tab.apiTabId = apiTabId;
      tab.isActive = isActive;
      tab.isOpen = isOpen;
    });
  }

  @writer async updateIsOpen({ isOpen }: Pick<TabModel, 'isOpen'>) {
    await this.update((tab) => {
      tab.isOpen = isOpen;
    });
  }

  @writer async updateIsActive({ isActive }: Pick<TabModel, 'isActive'>) {
    await this.update((tab) => {
      tab.isActive = isActive;
    });
  }

  @writer async closeTab() {
    await this.markAsDeleted();
  }

  // this.delete
  // @writer async deleteTabById({ id }: { id: string }) {
  //   const tab = await this.collections.get<TabModel>(TableName.TABS).find(id);

  //   return tab.markAsDeleted();
  // }
}
