import React from 'react';
import ReactDOM from 'react-dom/client';
import { StyleSheetManager } from 'styled-components';
import ToolbarHolderContainer from './container/toolbar-holder';
import { Database, DatabaseProvider } from '@workspace/watermelon';
import {
  SharedInPageUIState,
  InPageUIRootMount,
  ThemeProviderContext,
} from '../../common';

export interface ToolbarContainerDependencies {
  inPageUI: SharedInPageUIState;
  watermelonDb: Database;
}

let root: null | ReactDOM.Root = null;

export function setupFrontendToolbar(
  mount: InPageUIRootMount,
  dependencies: ToolbarContainerDependencies,
): void {
  // document.addEventListener('DOMContentLoaded', function (event) {
  if (!root) {
    root = ReactDOM.createRoot(mount.rootElement as HTMLElement);

    root.render(
      // render twice react 18 ???
      // <React.StrictMode>
      <StyleSheetManager target={mount.rootElement as any}>
        <ThemeProviderContext>
          <DatabaseProvider database={dependencies.watermelonDb}>
            <ToolbarHolderContainer dependencies={dependencies} />
          </DatabaseProvider>
        </ThemeProviderContext>
      </StyleSheetManager>,
      // </React.StrictMode>,
      // mount.rootElement,
    );
  }
  // });
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
