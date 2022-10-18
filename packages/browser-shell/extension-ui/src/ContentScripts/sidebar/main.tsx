import React from 'react';
import ReactDOM from 'react-dom/client';
import { Database, DatabaseProvider } from '@workspace/extension-base';
import { StyleSheetManager } from 'styled-components';
import {
  InPageUIRootMount,
  SharedInPageUIState,
  ThemeProviderContext,
} from '../../common';
import SidebarHolderContainer from './container/sidebar-holder';

export interface SidebarContainerDependencies {
  inPageUI: SharedInPageUIState;
  watermelonDb: Database;
}

export function setupFrontendSidebar(
  mount: InPageUIRootMount,
  dependencies: SidebarContainerDependencies,
): void {
  const root = ReactDOM.createRoot(mount.rootElement as HTMLElement);

  root.render(
    <React.StrictMode>
      <StyleSheetManager target={mount.shadowRoot as any}>
        <ThemeProviderContext>
          <DatabaseProvider database={dependencies.watermelonDb}>
            <SidebarHolderContainer dependencies={dependencies} />
          </DatabaseProvider>
        </ThemeProviderContext>
      </StyleSheetManager>
    </React.StrictMode>,
    // mount.rootElement,
  );
}

export function destroyFrontendSidebar(
  target: ReactDOM.Root, // HTMLElement,
  shadowRoot: ShadowRoot | null,
): void {
  // ReactDOM.unmountComponentAtNode(target);
  target.unmount();
  // if (shadowRoot) {
  //   shadowRoot.removeChild(target);
  // } else {
  //   document.body.removeChild(target);
  // }
}
