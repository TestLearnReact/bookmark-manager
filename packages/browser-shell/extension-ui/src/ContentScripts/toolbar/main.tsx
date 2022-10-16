import React from 'react';
// import * as ReactDOM from 'react-dom';
import ReactDOM from 'react-dom/client';
import { StyleSheetManager } from 'styled-components';
import ToolbarHolderContainer from './container/toolbar-holder';

import {
  SharedInPageUIState,
  InPageUIRootMount,
  ThemeProviderContext,
} from '../../common';

export interface ToolbarContainerDependencies {
  inPageUI: SharedInPageUIState;
}

export function setupFrontendToolbar(
  mount: InPageUIRootMount,
  dependencies: ToolbarContainerDependencies,
): void {
  const root = ReactDOM.createRoot(mount.rootElement as HTMLElement);

  root.render(
    <React.StrictMode>
      <StyleSheetManager target={mount.rootElement as any}>
        <ThemeProviderContext>
          <ToolbarHolderContainer dependencies={dependencies} />
        </ThemeProviderContext>
      </StyleSheetManager>
    </React.StrictMode>,
    // mount.rootElement,
  );
}

export function destroyFrontendToolbar(
  target: ReactDOM.Root, // HTMLElement,
  shadowRoot: ShadowRoot | null,
): void {
  // ReactDOM.unmountComponentAtNode(target); // todo
  target.unmount();

  // if (shadowRoot) {
  //   shadowRoot.removeChild(target);
  // } else {
  //   document.body.removeChild(target);
  // }
}
