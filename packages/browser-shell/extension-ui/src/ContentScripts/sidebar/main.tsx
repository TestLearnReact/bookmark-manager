import React from 'react';
import ReactDOM from 'react-dom/client';
import { Database, DatabaseProvider } from '@workspace/watermelon-db';
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

let root: null | ReactDOM.Root = null;

export function setupFrontendSidebar(
  mount: InPageUIRootMount,
  dependencies: SidebarContainerDependencies,
): void {
  // document.addEventListener('DOMContentLoaded', function (event) {
  // React 18 dev bugs!?
  if (!root) {
    root = ReactDOM.createRoot(mount.rootElement as HTMLElement);

    root.render(
      // render twice react 18 ???
      // <React.StrictMode>
      <StyleSheetManager target={mount.shadowRoot as any}>
        <ThemeProviderContext>
          <DatabaseProvider database={dependencies.watermelonDb}>
            <SidebarHolderContainer dependencies={dependencies} />
          </DatabaseProvider>
        </ThemeProviderContext>
      </StyleSheetManager>,
      // </React.StrictMode>,
    );
  }
  // });
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
