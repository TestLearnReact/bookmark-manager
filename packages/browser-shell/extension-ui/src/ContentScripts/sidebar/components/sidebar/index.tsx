import React, { ReactNode, useEffect, useState } from 'react';
import * as S from './styles';

import IconClose from '~icons/public-assets-icons/close.svg';

import styles from './Button.module.css';

import {
  SharedInPageUIState,
  TooltipButtonIcon,
  _DEV_OPTIONS,
} from '../../../../common';

import {
  InPageUIComponentShowState,
  msInPageUiStateStream,
} from '@workspace/extension-common';
import BookmarkList from '../BookmarkList';
import { useDatabase } from '@workspace/watermelon';

export const Sidebar: React.FC<{ inPageUI: SharedInPageUIState }> = ({
  inPageUI,
}) => {
  // const [sharedInPageUiState, setSharedInPageUiState] =
  //   useState<InPageUIComponentShowState>(inPageUI.componentsShown);

  // useEffect(() => {
  //   msInPageUiStateStream.subscribe(([{ toolbar, sidebar }]) => {
  //     console.log('sidebar msInPageUiStateStream', sharedInPageUiState);
  //     setSharedInPageUiState({ toolbar, sidebar });
  //   });
  // }, []);

  // if (!sharedInPageUiState.sidebar && !_DEV_OPTIONS.DEV_SDEBAR_OPEN)
  //   return null;

  const database = useDatabase();

  return (
    <S.Container>
      {/* <SidbarTopBar>
        <TooltipButtonIcon
          iconProps={{
            icon: IconClose,
          }}
          tooltipProps={{ tooltipText: 'Close' }}
          onClick={() => console.log('...')}
        />
      </SidbarTopBar> */}
      {/* <S.Content>.. Content ..</S.Content> */}
      <BookmarkList database={database} />

      <CssModuleTestButton>.</CssModuleTestButton>
    </S.Container>
  );
};

const SidbarTopBar: React.FC<{ children: ReactNode }> = ({ children }) => (
  <>
    <S.TopBarContainer>{children}</S.TopBarContainer>
  </>
);

const CssModuleTestButton: React.FC<{ children: ReactNode }> = ({
  children,
}) => (
  <>
    <button className={styles.error}>Error Button</button>
  </>
);
