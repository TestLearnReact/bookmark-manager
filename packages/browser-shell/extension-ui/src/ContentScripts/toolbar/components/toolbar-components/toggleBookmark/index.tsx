import React from 'react';

import { SvgTooltipComponent } from '@workspace/extension-ui/common';

import IconFavorite from '~icons/public-assets-icons/favorite.svg';
import IconfavoriteFilled from '~icons/public-assets-icons/favoriteFilled.svg';

// import {
//   BookmarkModel,
//   Database,
//   ExtractedObservables,
//   TableName,
//   Q,
//   deleteBookmarkByUrl,
//   createBookmark,
//   mySync,
// } from '@workspace/watermelon-db';

// import withObservables from '@nozbe/with-observables';
import {
  Database,
  Q,
  BookmarkModel,
  TableName,
  withObservables,
  ExtractedObservables,
  createBookmark,
  deleteBookmarkByUrl,
  syncWatermelonDbFrontends,
} from '@workspace/extension-base';

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
    console.log(isBookmarked, bookmark);
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
    await syncWatermelonDbFrontends({ database });
  };

  return (
    <SvgTooltipComponent
      iconProps={{
        icon: isBookmarked ? IconfavoriteFilled : IconFavorite,
        className: '_ToggleBookmark ignore-react-onclickoutside',
      }}
      tooltipProps={{
        tooltipText: getTooltipText('Toggle bookmark'),
        position: 'leftNarrow',
      }}
      onClick={() => toggle()}
    />
  );
};

export default withObservables([], getObservables)(ToggleBookmark);
