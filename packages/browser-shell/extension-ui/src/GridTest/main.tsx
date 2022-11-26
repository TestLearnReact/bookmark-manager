import React from 'react';
import ReactDOM from 'react-dom/client';
import { SharedInPageUIState, ThemeProviderContext } from '../common';
import { dataRatio } from './data';

// import Gallery from './Grid1/Gallery';
import { Gallery2 } from './Grid2/main';

export interface GridContainerDependencies {
  inPageUI?: SharedInPageUIState;
}

export function setupFrontendGrid(
  dependencies?: GridContainerDependencies,
): void {
  const root = ReactDOM.createRoot(
    document.getElementById('app') as HTMLElement,
  );

  root.render(
    <React.StrictMode>
      {/* GALLERY 1:
      <br />
      <Gallery />
      <br /> */}
      GALLERY 2:
      <Gallery2 gridElements={dataRatio} height={800} width={800} />
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
