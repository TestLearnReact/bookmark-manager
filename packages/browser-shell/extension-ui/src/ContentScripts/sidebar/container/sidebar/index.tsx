import React, { useEffect, useRef, useState } from 'react';
import { SidebarContainerDependencies } from '../../main';
import {
  InPageUIComponentShowState,
  msInPageUiStateStream,
  msSharedStateSettingsStream,
} from '@workspace/extension-common';
import {
  darkTheme,
  lightTheme,
  useThemeContext,
  _DEV_OPTIONS,
  ThemeProvider as StyledComponentThemeProvider,
  useClickOutside,
} from '@workspace/extension-ui/common';

import { Sidebar } from '../../components/sidebar';

import * as S from './styles';

interface SidebarHolderProps {
  dependencies: SidebarContainerDependencies;
}

const SidebarContainer: React.FC<SidebarHolderProps> = ({ dependencies }) => {
  console.log('r.e.r.e.n.d.e.r SidebarContainer');

  const { inPageUI } = dependencies;

  const ref = useRef<HTMLDivElement>(null);

  const { themeType, setCurrentTheme, theme } = useThemeContext();

  useEffect(() => {
    msSharedStateSettingsStream.subscribe(([{ theme }]) => {
      setCurrentTheme(theme);
      // sharedInPageUiState.sidebar &&
    });
  }, []);

  const [sharedInPageUiState, setSharedInPageUiState] =
    useState<InPageUIComponentShowState>(inPageUI.componentsShown);

  useEffect(() => {
    msInPageUiStateStream.subscribe(([{ toolbar, sidebar }]) => {
      console.log('sidebar msInPageUiStateStream', sharedInPageUiState);
      setSharedInPageUiState({ toolbar, sidebar });
    });
  }, []);

  const handleClickOutside = () => {
    console.log('clicked outside');
    inPageUI.hideSidebar();
  };

  const IGNORE_CLICK_OUTSIDE_CLASS = 'ignore-react-onclickoutside';

  useClickOutside({
    ref,
    callback: handleClickOutside,
    ignoreClassNames: IGNORE_CLICK_OUTSIDE_CLASS,
  });

  if (!sharedInPageUiState.sidebar && !_DEV_OPTIONS.DEV_SDEBAR_OPEN)
    return null;

  return (
    <>
      {/* Theme styled-component */}
      <StyledComponentThemeProvider
        theme={themeType === 'light' ? lightTheme : darkTheme}
      >
        {/* Theme scss + css variables in style={} */}
        <div
          className={
            '_sidbarContainer theme-' +
            (themeType === 'dark' ? 'dark' : 'light')
          }
          style={
            {
              ...theme,
            } as React.CSSProperties
          }
        >
          <S.GlobalStyle sidebarWidth={'350px'} />

          <S.OuterContainerStyled
            ref={ref}
            id='outerContainer'
            className='ContainerStyled _outerContainerStyled'
          >
            <S.InnerContainerStyled className='_innerContainerStyled'>
              <Sidebar inPageUI={inPageUI} />
            </S.InnerContainerStyled>
          </S.OuterContainerStyled>

          {/* <S.ContainerStyled
            ref={ref}
            id="outerContainer"
            className="ContainerStyled"
          >
            <Sidebar />
          </S.ContainerStyled> */}
        </div>
      </StyledComponentThemeProvider>
    </>
  );
};

export default SidebarContainer;
