import React from 'react';
import ReactDOM from 'react-dom/client';
import { StyleSheetManager } from 'styled-components';
import { SharedInPageUIState, ThemeProviderContext } from '../common';

import { Options } from './Options';

export interface OptionsContainerDependencies {
  inPageUI?: SharedInPageUIState;
}

export function setupFrontendOptions(
  dependencies?: OptionsContainerDependencies,
): void {
  const root = ReactDOM.createRoot(
    document.getElementById('app') as HTMLElement,
  );

  root.render(
    <React.StrictMode>
      <Options />
    </React.StrictMode>,
  );
}

{
  /* <React.StrictMode>
<StyleSheetManager target={root as any}>
  <ThemeProviderContext>
    <Options />
  </ThemeProviderContext>
</StyleSheetManager>
</React.StrictMode>, */
}
