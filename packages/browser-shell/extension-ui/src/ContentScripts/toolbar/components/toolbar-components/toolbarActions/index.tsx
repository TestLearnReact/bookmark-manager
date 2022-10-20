import React from 'react';
import cx from 'classnames';
import IconClose from '~icons/public-assets-icons/close.svg';
import IconOpenSidebar from '~icons/public-assets-icons/openSidebar.svg';
import IconAsleep from '~icons/public-assets-icons/asleep.svg';
import IconAsleepFilled from '~icons/public-assets-icons/asleepFilled.svg';
import IconFavorite from '~icons/public-assets-icons/favorite.svg';
import IconfavoriteFilled from '~icons/public-assets-icons/favoriteFilled.svg';
import {
  useThemeContext,
  SvgTooltipComponent,
} from '@workspace/extension-ui/common';

import { ToolbarSidebarProps } from '../../toolbar';
import ToggleBookmark from '../toggleBookmark';
import { useDatabase } from '@workspace/extension-base';

export interface IToolbarActionsProps {
  sidebar: ToolbarSidebarProps;
  handleRemoveToolbar: () => void;
  toggleSidebar: () => void;
  toggleTheme: () => void;
}

const ToolbarActions: React.FC<IToolbarActionsProps> = ({
  sidebar,
  handleRemoveToolbar,
  toggleSidebar,
  toggleTheme,
}) => {
  const { themeType } = useThemeContext();

  const getTooltipText = (name: string): string => {
    return name;
  };

  // const database = useDatabase();

  return (
    <div className='generalActions'>
      <SvgTooltipComponent
        iconProps={{
          icon: IconClose,
        }}
        tooltipProps={{
          tooltipText: getTooltipText('Close Toolbar for session'),
          position: 'leftNarrow',
        }}
        onClick={() => handleRemoveToolbar()}
      />
      <SvgTooltipComponent
        iconProps={{
          icon: IconOpenSidebar,
          className: cx({
            arrow: !sidebar.isSidebarOpen,
            arrowReverse: sidebar.isSidebarOpen,
          }),
        }}
        tooltipProps={{
          tooltipText: getTooltipText('Toggle sidebar'),
          position: 'leftNarrow',
        }}
        onClick={() => toggleSidebar()}
      />
      <SvgTooltipComponent
        iconProps={{
          icon: themeType === 'dark' ? IconAsleep : IconAsleepFilled,
          className: 'ignore-react-onclickoutside',
        }}
        tooltipProps={{
          tooltipText: getTooltipText('Toggle theme'),
          position: 'leftNarrow',
        }}
        onClick={() => toggleTheme()}
      />
      {/* <ToggleBookmark
        getTooltipText={getTooltipText}
        toggleBookmark={() => 'l'}
        database={database}
      /> */}
    </div>
  );
};

export default ToolbarActions;
