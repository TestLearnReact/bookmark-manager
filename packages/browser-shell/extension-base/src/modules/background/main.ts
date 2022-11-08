import browser, { Runtime } from 'webextension-polyfill';
import { TabManagementBackground } from '../tab-management';
import { Database, genWatermelonDb } from '@workspace/watermelon-db';

export class MainModuleBackground {
  private runtimeAPI: Runtime.Static;
  private tabManagementBackground: TabManagementBackground;

  static database: Database;
  static dbName: 'WatermelonDbBackgound';

  constructor({
    runtimeAPI = browser.runtime,
    tabManagementBackground,
  }: {
    runtimeAPI?: Runtime.Static;
    tabManagementBackground: TabManagementBackground;
  }) {
    this.runtimeAPI = runtimeAPI;
    this.tabManagementBackground = tabManagementBackground;
  }

  public async getWatermelonDb() {
    return MainModuleBackground.database;
  }

  private async handleInstallLogic(now = Date.now()) {
    console.log('- Install Logic -', now);
    // const database = await genWatermelonDb({
    //   dbName: MainModuleBackground.dbName,
    // });
    // MainModuleBackground.database = database;
    // await database.write(async () => {
    //   await database.unsafeResetDatabase();
    // });
  }

  private async handleUpdateLogic(now = Date.now()) {
    console.log('- Update Logic -', now);
  }

  /**
   * Runs on both extension update and install.
   */
  private async handleUnifiedLogic() {
    console.log('- Unified Logic -');
    await this.tabManagementBackground.trackExistingTabs();
  }

  /**
   * Set up logic that will get run on ext install, update, browser update.
   * https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onInstalled
   */
  private setupInstallHooks() {
    this.runtimeAPI.onInstalled.addListener(async (details) => {
      switch (details.reason) {
        case 'install':
          await this.handleUnifiedLogic();
          return this.handleInstallLogic();
        case 'update':
          await this.handleUnifiedLogic();
          return this.handleUpdateLogic();
        default:
      }
    });
  }

  // browser restarted
  private setupStartupHooks() {
    console.log('setupStartupHooks');
    this.runtimeAPI.onStartup.addListener(async () => {
      console.log('setupStartupHooks 22');
      await this.tabManagementBackground.trackExistingTabs();
    });
  }

  setupWebExtAPIHandlers() {
    this.setupInstallHooks();
    this.setupStartupHooks();
    // this.setupCommands()
    // this.setupUninstallURL()
  }
}
