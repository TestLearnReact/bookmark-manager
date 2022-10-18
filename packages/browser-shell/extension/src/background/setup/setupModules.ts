import { IBackgroundModules } from '.';

/**
 * Setup/Initial Modules
 *  */
export async function setupBackgroundModules(
  backgroundModules: IBackgroundModules,
) {
  /** Extension install, update Logic etc */
  backgroundModules.mainModuleBackground.setupWebExtAPIHandlers();
}
