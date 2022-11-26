import React, { useEffect, useRef, useState } from 'react';
import { ToolbarContainerDependencies } from '../../main';
import {
  InPageUIComponentShowState,
  msInPageUiStateStream,
} from '@workspace/extension-common';

import { useThemeContext } from '../../../../common/context';
// import { darkTheme, lightTheme, ThemeProvider } from '~extension-ui';
import {
  darkTheme,
  lightTheme,
  ThemeProvider as StyledComponentThemeProvider,
} from '../../../../common';

import Toolbar from '../../components/toolbar';
import {
  createBookmark,
  isBookmarked,
  useDatabase,
} from '@workspace/extension-base';

interface IToolbarContainer {
  dependencies: ToolbarContainerDependencies;
  toolbarRef: React.RefObject<HTMLDivElement>;
}

const ToolbarContainer: React.FC<IToolbarContainer> = ({
  dependencies,
  toolbarRef,
}) => {
  // console.log('.r.e.n.d.e.r ToolbarContainer');

  const { inPageUI } = dependencies;

  const { themeType, theme } = useThemeContext();

  const [sharedInPageUiState, setSharedInPageUiState] =
    useState<InPageUIComponentShowState>(inPageUI.componentsShown);

  // const refState = useRef<InPageUIComponentShowState>(inPageUI.componentsShown);

  useEffect(() => {
    console.log('useEffect toolbar []');
    msInPageUiStateStream.subscribe(([{ toolbar, sidebar }, sender]) => {
      // console.log('toolbar msInPageUiStateStream', toolbar, sidebar);
      setSharedInPageUiState({ toolbar, sidebar });
    });
  }, []);

  const handleSidebarOpen = () => {
    inPageUI.showSidebar();
  };

  const database = useDatabase();

  const url = () => window.location.href;
  const normalizedUrl = window.location.href;
  const title = document.title;

  const toggleBookmark = async () => {
    const is = await isBookmarked({ database, url: url() });
    // const is = await database
    //   .get<BookmarkModel>('bookmarks')
    //   .query(Q.where('url', Q.eq('https://www.google.com/')))
    //   .fetch();

    console.log('iss', is);

    await createBookmark({
      database,
      fields: {
        url: url(),
        normalizedUrl: window.location.href,
        title: document.title,
      },
    });
    // console.log(window.location.href);
    // const url = window.location.href;
    // const isBookmarked = await database.collections
    //   .get<BookmarkModel>(TableName.BOOKMARKS)
    //   .query(Q.where('url', url))
    //   .fetch();

    // if (!isBookmarked[0]) {
    //   console.log('create', isBookmarked[0], isBookmarked);
    //   await database.write(async (writer) => {
    //     const bookmark = await database.collections
    //       .get<BookmarkModel>(TableName.BOOKMARKS)
    //       .create((b) => {
    //         (b.url = window.location.href),
    //           (b.normalizedUrl = window.location.href),
    //           (b.title = document.title);
    //       });
    //     return bookmark;
    //   });
    // }

    // if (isBookmarked[0]) {
    //   console.log('delete', isBookmarked[0]);
    //   await database.write(async (writer) => {
    //     const del = await database.collections
    //       .get<BookmarkModel>(TableName.BOOKMARKS)
    //       .query(Q.where('url', window.location.href))
    //       .markAllAsDeleted();

    //     return del;
    //   });
    // }
  };

  //  if (!sharedInPageUiState.toolbar) return null;
  return (
    <>
      {/* Theme styled-component */}
      <StyledComponentThemeProvider
        theme={themeType === 'light' ? lightTheme : darkTheme}
      >
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
            bookmark={{ toggleBookmark: () => toggleBookmark() }}
          />
        </div>
      </StyledComponentThemeProvider>
    </>
  );
};

export default ToolbarContainer;
