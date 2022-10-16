import React from 'react';
import ReactDOM from 'react-dom/client';
import { StyleSheetManager } from 'styled-components';
import { SharedInPageUIState, ThemeProviderContext } from '../common';

import { Popup } from './Popup';

export interface PopupContainerDependencies {
  inPageUI?: SharedInPageUIState;
}

export function setupFrontendPopup(
  dependencies?: PopupContainerDependencies,
): void {
  const root = ReactDOM.createRoot(
    document.getElementById('app') as HTMLElement,
  );

  root.render(
    <React.StrictMode>
      <Popup />
    </React.StrictMode>,
  );
}

{
  /* <React.StrictMode>
<StyleSheetManager target={root as any}>
  <ThemeProviderContext>
    <Popup />
  </ThemeProviderContext>
</StyleSheetManager>
</React.StrictMode>, */
}
