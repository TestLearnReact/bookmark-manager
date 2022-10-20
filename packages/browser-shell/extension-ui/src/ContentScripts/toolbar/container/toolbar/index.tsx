import React, { useEffect, useRef, useState } from 'react';
import { ToolbarContainerDependencies } from '../../main';
import {
  InPageUIComponentShowState,
  msInPageUiStateStream,
} from '@workspace/extension-common';

import { useThemeContext } from '../../../../common/context';
// import { darkTheme, lightTheme, ThemeProvider } from '~extension-ui';
import { darkTheme, lightTheme, ThemeProvider } from '../../../../common';

import Toolbar from '../../components/toolbar';

interface IToolbarContainer {
  dependencies: ToolbarContainerDependencies;
  toolbarRef: React.RefObject<HTMLDivElement>;
}

const ToolbarContainer: React.FC<IToolbarContainer> = ({
  dependencies,
  toolbarRef,
}) => {
  console.log('.r.e.n.d.e.r ToolbarContainer');

  const { inPageUI } = dependencies;

  const { themeType, theme } = useThemeContext();

  const [sharedInPageUiState, setSharedInPageUiState] =
    useState<InPageUIComponentShowState>(inPageUI.componentsShown);

  const refState = useRef<InPageUIComponentShowState>(inPageUI.componentsShown);

  useEffect(() => {
    console.log('useEffect toolbar []');
    msInPageUiStateStream.subscribe(([{ toolbar, sidebar }, sender]) => {
      console.log('toolbar msInPageUiStateStream', toolbar, sidebar);
      // console.log(
      //   refState.current,
      //   sharedInPageUiState,
      //   refState.current == sharedInPageUiState,
      // );
      // console.log(
      //   refState.current.toolbar,
      //   toolbar,
      //   '//',
      //   refState.current.toolbar !== toolbar,
      //   refState.current.sidebar !== sidebar,
      // );
      // if (
      //   refState.current.toolbar !== toolbar ||
      //   refState.current.sidebar !== sidebar
      // )
      setSharedInPageUiState({ toolbar, sidebar });
    });
  }, []);

  const handleSidebarOpen = () => {
    inPageUI.showSidebar();
  };

  //  if (!sharedInPageUiState.toolbar) return null;
  return (
    <>
      {/* Theme styled-component */}
      <ThemeProvider theme={themeType === 'light' ? lightTheme : darkTheme}>
        {/* Theme scss + css variables in style={} */}
        <div
          className={'theme-' + (themeType === 'dark' ? 'dark' : 'light')}
          style={
            {
              ...theme,
            } as React.CSSProperties
          }
        >
          <Toolbar
            dependencies={dependencies} // no need container/component structure
            toolbarRef={toolbarRef}
            sharedInPageUiState={sharedInPageUiState}
            handleRemoveToolbar={() => inPageUI.removeToolbar()}
            sidebar={{
              isSidebarOpen: sharedInPageUiState.sidebar,
              openSidebar: () => handleSidebarOpen(),
              closeSidebar: () => inPageUI.hideSidebar(),
              toggleSidebar: () => inPageUI.toggleSidebar(),
            }}
          />
        </div>
      </ThemeProvider>
    </>
  );
};

export default ToolbarContainer;
