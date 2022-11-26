import React, { useEffect, useRef, useState } from 'react';
import { Rnd } from 'react-rnd';
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
  // console.log('r.e.r.e.n.d.e.r SidebarContainer');

  const { inPageUI } = dependencies;

  const ref = useRef<HTMLDivElement>(null);

  const { themeType, setCurrentTheme, theme } = useThemeContext();

  const [sidebarWidth, setSidebarWidth] = useState<{ width: string }>({
    width: '450px',
  });

  const [isSidebarPeeking, setIsSidebarPeeking] = useState<boolean>(false);
  const [isSidebarLocked, setIsSidebarLocked] = useState<boolean>(false);

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
      // console.log('sidebar msInPageUiStateStream', sharedInPageUiState);
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

  const style = {
    top: '0',
    height: '100vh',
  } as const;

  const refSidebar = useRef();

  console.log('THEME', themeType, theme);

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
          <S.GlobalStyle sidebarWidth={sidebarWidth.width} />

          <S.SidebarContainer className='__SidebarContainer' ref={ref}>
            <S.SidebarResize
              resizeHandleWrapperClass={'sidebarResizeHandle'}
              className='sidebar-draggable'
              minWidth={'409px'}
              maxWidth={'1000px'}
              disableDragging={true}
              enableResizing={{
                top: false,
                right: false,
                bottom: false,
                left: true,
                topRight: false,
                bottomRight: false,
                bottomLeft: false,
                topLeft: false,
              }}
            >
              <Sidebar inPageUI={inPageUI} />
            </S.SidebarResize>
          </S.SidebarContainer>
        </div>
      </StyledComponentThemeProvider>
    </>
  );
};

export default SidebarContainer;

// <S.OuterContainerStyled
// ref={ref}
// id='outerContainer'
// className='ContainerStyled _outerContainerStyled'
// >
// <Rnd
//   style={style}
//   default={{
//     x: 0,
//     y: 0,
//     width: 450,
//     height: 'auto',
//   }}
//   resizeHandleWrapperClass={'sidebarResizeHandle'}
//   className='sidebar-draggable'

//   // resizeGrid={[1, 0]}
//   // dragAxis={'none'}
//   // minWidth={'340px'}
//   // maxWidth={'1000px'}
//   // disableDragging={true}
//   // enableResizing={{
//   //   top: false,
//   //   right: false,
//   //   bottom: false,
//   //   left: true,
//   //   topRight: false,
//   //   bottomRight: false,
//   //   bottomLeft: false,
//   //   topLeft: false,
//   // }}
//   onResize={(e, direction, ref, delta, position) => {
//     setSidebarWidth({ width: ref.style.width });
//     // this.setState({ sidebarWidth: ref.style.width });
//     // setLocalStorage(SIDEBAR_WIDTH_STORAGE_KEY, ref.style.width);
//   }}
// >
//   {/* <S.SidebarContainerWithTopBar>rrrr</S.SidebarContainerWithTopBar> */}

//   <S.InnerContainerStyled
//     className='_innerContainerStyled'
//     sidebarWidth={sidebarWidth.width}
//   >
//     {/* <S.SidebarContainerWithTopBar>
//     <Sidebar inPageUI={inPageUI} />
//   </S.SidebarContainerWithTopBar> */}
//   </S.InnerContainerStyled>
// </Rnd>
// </S.OuterContainerStyled>
