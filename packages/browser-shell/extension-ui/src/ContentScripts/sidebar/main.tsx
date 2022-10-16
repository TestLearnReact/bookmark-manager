import React from 'react';
import ReactDOM from 'react-dom/client';
// import * as ReactDOM from 'react-dom';
import { StyleSheetManager } from 'styled-components';
import {
  InPageUIRootMount,
  SharedInPageUIState,
  ThemeProviderContext,
} from '../../common';
import SidebarHolderContainer from './container/sidebar-holder';

export interface SidebarContainerDependencies {
  inPageUI: SharedInPageUIState;
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
          <SidebarHolderContainer dependencies={dependencies} />
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
