/* eslint-disable */
import {
  InPageUIComponent,
  InPageUIComponentShowState,
  msSendComponentDestroy,
  msSendComponentInit,
  msSendInPageUiState,
  SharedInPageUIInterface,
} from '@workspace/extension-common';
// import {
//   InPageUIComponentShowState,
//   InPageUIComponent,
//   SharedInPageUIInterface,
// } from './types';

export const isCsDevHtmlFirefox = (url: string) =>
  url.includes('moz-extension://') && url.includes('/dist/csdev/index.html');

export interface SharedInPageUIDependencies {
  loadComponent: (component: InPageUIComponent) => void;
  unloadComponent: (component: InPageUIComponent) => void;
}

export class SharedInPageUIState implements SharedInPageUIInterface {
  componentsShown: InPageUIComponentShowState = {
    toolbar: false,
    sidebar: false,
  };

  componentsSetUp: InPageUIComponentShowState = {
    toolbar: false,
    sidebar: false,
  };

  constructor(private options: SharedInPageUIDependencies) {}

  async toggleTheme(options?: any) {
    // if (this.componentsShown.sidebar) return;
    // this.componentsShown.sidebar = true;
    // this.componentsShown.toolbar = true;
    // await msSendInPageUiState({
    //   ...this.componentsShown,
    //   toolbar: true,
    //   sidebar: true,
    // });
  }

  async showSidebar(options?: any) {
    if (this.componentsShown.sidebar) return;
    console.log('showSidebar');
    this.componentsShown.sidebar = true;
    this.componentsShown.toolbar = true;
    await msSendInPageUiState({
      ...this.componentsShown,
      toolbar: true,
      sidebar: true,
    });
  }

  async hideSidebar() {
    if (!this.componentsShown.sidebar) return;

    this.componentsShown.sidebar = false;

    await msSendInPageUiState({
      ...this.componentsShown,
      sidebar: false,
    });
  }

  async toggleSidebar() {
    if (this.componentsShown.sidebar) {
      await this.hideSidebar();
    } else {
      await this.showSidebar({ action: 'comment' });
    }
  }

  async loadComponent(component: InPageUIComponent, options: any = {}) {
    await this.options.loadComponent(component);
    this._maybeEmitShouldSetUp(component, options);
  }

  async showToolbar(options?: { action?: any }) {
    if (this.componentsShown.toolbar) return;
    console.log('showToolbar');
    this.componentsShown.toolbar = true;
    await msSendInPageUiState({
      ...this.componentsShown,
      toolbar: true,
    });
  }

  async hideToolbar() {
    if (!this.componentsShown.toolbar) return;

    this.componentsShown.toolbar = false;
    this.componentsShown.sidebar = false;
    await msSendInPageUiState({
      ...this.componentsShown,
      toolbar: false,
      sidebar: false,
    });
  }

  async toggleToolbar() {
    if (this.componentsShown.toolbar) {
      await this.hideToolbar();
    } else {
      await this.showToolbar();
    }
  }

  async removeToolbar() {
    if (this.componentsSetUp.sidebar) {
      await this._removeComponent('sidebar');
    }
    await this._removeComponent('toolbar');
  }

  async reloadToolbar() {
    await this.reloadComponent('toolbar');
    await this.reloadComponent('sidebar');
  }

  _removeComponent(component: InPageUIComponent) {
    this.options.unloadComponent(component);
    this.componentsShown[component] = false;
    this.componentsSetUp[component] = false;
    msSendComponentDestroy({ component });
  }

  async reloadComponent(component: InPageUIComponent, options: any = {}) {
    await this.options.loadComponent(component);
    msSendComponentInit({ component: component, scriptSender: component });
  }

  private async _maybeEmitShouldSetUp(
    component: InPageUIComponent,
    options: any = {},
  ) {
    if (this.componentsSetUp[component]) return;

    this.componentsSetUp[component] = true;
    await msSendComponentInit({
      component: component,
      scriptSender: component,
    });
  }

  /** development -> no script injected */
  async setComponentShouldSetup({
    component,
    shouldSetUp,
  }: {
    component: InPageUIComponent;
    shouldSetUp: boolean;
  }) {
    if (this.componentsSetUp[component]) return;

    this.componentsSetUp[component] = shouldSetUp;
  }
}
