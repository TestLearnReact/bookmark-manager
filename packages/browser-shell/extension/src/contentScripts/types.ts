import {
  SidebarContainerDependencies,
  ToolbarContainerDependencies,
} from '@workspace/extension-ui';

export type ContentScriptComponent = 'sidebar' | 'toolbar';
// | 'main'
// | 'polyfill';

export interface ContentScriptRegistry {
  registerToolbarScript(main: ToolbarScriptMain): Promise<void>;
  registerSidebarScript(main: SidebarScriptMain): Promise<void>;
}
export type ToolbarScriptMain = (
  dependencies: ToolbarContainerDependencies, // Omit<ToolbarContainerDependencies, "currentTab">
) => Promise<void>;

export type SidebarScriptMain = (
  dependencies: SidebarContainerDependencies, // Omit<SidebarContainerDependencies, "pageUrl">
) => Promise<void>;
