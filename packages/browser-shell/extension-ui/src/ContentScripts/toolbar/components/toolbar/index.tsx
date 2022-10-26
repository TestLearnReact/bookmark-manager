import React from 'react';
import cx from 'classnames';
import { ToolbarContainerDependencies } from '../../main';
import { InPageUIComponentShowState } from '@workspace/extension-common';
import ToolbarActions from '../toolbar-components/toolbarActions';

// import { _DEV_OPTIONS, useThemeContext } from '~extension-ui';
import { _DEV_OPTIONS, useThemeContext } from '../../../../common';

import './styles.scss';

export interface IToolbarSidebarProps {
  isSidebarOpen: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
}

export interface IToolbarBookmarkProps {
  toggleBookmark: () => void;
}

export interface ToolbarSubcomponentProps {
  sidebar: IToolbarSidebarProps;
  bookmark: IToolbarBookmarkProps;
}

interface IToolbarProps extends ToolbarSubcomponentProps {
  dependencies: ToolbarContainerDependencies; // no need container/component structure
  toolbarRef: React.RefObject<HTMLDivElement>;
  handleRemoveToolbar: () => void;
  sharedInPageUiState: InPageUIComponentShowState;
}

const Toolbar: React.FC<IToolbarProps> = (props) => {
  console.log('r.e.r.e.n.d.e.r Toolbar');

  const {
    dependencies, // no need container/component structure
    toolbarRef,
    handleRemoveToolbar,
    sharedInPageUiState,
    sidebar,
    bookmark,
  } = props;

  const { themeType, setCurrentTheme } = useThemeContext();

  const toggleSidebar = () => {
    sidebar.toggleSidebar();
  };

  return (
    <div
      className={cx('toolbar', 'ignore-react-onclickoutside', {
        toolbarExpanded:
          sharedInPageUiState.toolbar || _DEV_OPTIONS.DEV_TOOLBAR_OPEN,
        toolbarSidebarOpen:
          sharedInPageUiState.sidebar || _DEV_OPTIONS.DEV_SDEBAR_OPEN,
      })}
    >
      <div
        ref={toolbarRef}
        className={cx('innerToolbar', 'ignore-react-onclickoutside', {
          innerToolbarExpanded:
            sharedInPageUiState.toolbar || _DEV_OPTIONS.DEV_TOOLBAR_OPEN,
          innerToolbarSidebarOpen:
            sharedInPageUiState.sidebar || _DEV_OPTIONS.DEV_SDEBAR_OPEN,
        })}
      >
        {(sharedInPageUiState.toolbar ||
          sidebar.isSidebarOpen ||
          _DEV_OPTIONS.DEV_TOOLBAR_OPEN) && (
          <>
            <ToolbarActions
              sidebar={sidebar}
              bookmark={bookmark}
              handleRemoveToolbar={handleRemoveToolbar}
              toggleSidebar={toggleSidebar}
              toggleTheme={() =>
                setCurrentTheme(themeType === 'dark' ? 'light' : 'dark')
              }
            />
            {/* <div className="generalActions">
              {(!sidebar.isSidebarOpen || true) && (
                <>
                  <CloseToolbar
                    tooltipText={"Close Toolbar for session"}
                    handleRemoveToolbar={handleRemoveToolbar}
                  />
                  <ToggleSidebar
                    tooltipText={getTooltipText("toggleSidebar")}
                    sidebar={sidebar}
                  />
                  <ToggleTheme tooltipText="Toggle Theme" />
                </>
              )}
            </div> */}
          </>
        )}
      </div>
    </div>
  );
};

export default Toolbar;
