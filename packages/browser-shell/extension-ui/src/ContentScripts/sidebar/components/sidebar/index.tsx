import React, { ReactNode, useEffect } from 'react';
import * as S from './styles';

import IconClose from '~icons/public-assets-icons/close.svg';
import { TooltipButtonIcon } from '../../../../common';

import styles from './Button.module.css';
import BookmarkList from '../BookmarkList';
import {
  BookmarkModel,
  Query,
  TableName,
  useDatabase,
} from '@workspace/extension-base';

export const Sidebar: React.FC = () => {
  return (
    <S.Container>
      <SidbarTopBar>
        <TooltipButtonIcon
          iconProps={{
            icon: IconClose,
          }}
          tooltipProps={{ tooltipText: 'Close' }}
          onClick={() => console.log('...')}
        />
      </SidbarTopBar>
      {/* <S.Content>.. Content ..</S.Content> */}
      {/* <BookmarkList bookmarks={[]} /> */}

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
