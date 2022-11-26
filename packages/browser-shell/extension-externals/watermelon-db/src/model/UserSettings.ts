import { Model, Q } from '@nozbe/watermelondb';
import { date, field, readonly, writer } from '@nozbe/watermelondb/decorators';

import { TableName } from '../types';

export interface IUserSettings {
  themeType: 'light' | 'dark';
}

export class UserSettingModel extends Model {
  static table = TableName.USER_SETTINGS;

  @field('theme_type') themeType!: string;
  @readonly @date('created_at') createdAt;
  @readonly @date('updated_at') updatedAt;

  @writer async setTheme(theme: IUserSettings['themeType']) {
    await this.update((setting) => {
      setting.themeType = theme;
    });
  }

  @writer async toggleTheme() {
    this.update((setting) => {
      setting.themeType = setting.themeType ? 'light' : 'dark';
    });
  }

  get isThemeLight() {
    return this.themeType === 'light';
  }

  get isThemeDark() {
    return this.themeType === 'dark';
  }

  get getTheme() {
    return this.themeType;
  }
}
