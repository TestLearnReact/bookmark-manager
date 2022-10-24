import React, { useEffect } from 'react';

import { SvgTooltipComponent } from '@workspace/extension-ui/common';

import IconFavorite from '~icons/public-assets-icons/favorite.svg';
import IconfavoriteFilled from '~icons/public-assets-icons/favoriteFilled.svg';

import { compose } from 'recompose';

import {
  BookmarkModel,
  Database,
  ExtractedObservables,
  TableName,
  Q,
  deleteBookmarkByUrl,
  createBookmark,
} from '@workspace/watermelon';
import withObservables from '@nozbe/with-observables';

const getObservables = ({
  database,
  pageData,
}: {
  database: Database;
  pageData: { url: () => string; title: () => string };
}) => ({
  bookmark: database.collections
    .get<BookmarkModel>(TableName.BOOKMARKS)
    .query(Q.where('url', pageData.url()))
    .observe(),
});

interface IToggleBookmark
  extends ExtractedObservables<ReturnType<typeof getObservables>> {
  toggleBookmark: () => void;
  getTooltipText: (test: string) => string;
  database: Database;
  pageData: { url: () => string; title: () => string };
}

const ToggleBookmark: React.FC<IToggleBookmark> = ({
  toggleBookmark,
  getTooltipText,
  bookmark,
  database,
  pageData,
}) => {
  const isBookmarked = Array.isArray(bookmark) && bookmark.length > 0;

  const toggle = async () => {
    const isBookmarked = Array.isArray(bookmark) && bookmark.length > 0;

    if (!isBookmarked) {
      createBookmark({
        database,
        fields: {
          url: pageData.url(),
          normalizedUrl: pageData.url(),
          title: pageData.title(),
        },
      });
    }
    if (isBookmarked) {
      deleteBookmarkByUrl({ database, url: pageData.url() });
    }
  };

  return (
    <SvgTooltipComponent
      iconProps={{
        icon: isBookmarked ? IconfavoriteFilled : IconFavorite,
        className: 'ignore-react-onclickoutside',
      }}
      tooltipProps={{
        tooltipText: getTooltipText('Toggle bookmark'),
        position: 'leftNarrow',
      }}
      onClick={() => toggle()}
    />
  );
};

export default withObservables(['database'], getObservables)(ToggleBookmark);
