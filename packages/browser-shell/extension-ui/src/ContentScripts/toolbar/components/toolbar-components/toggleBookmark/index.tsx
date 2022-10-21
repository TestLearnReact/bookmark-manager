import React from 'react';

import { SvgTooltipComponent } from '@workspace/extension-ui/common';

import IconFavorite from '~icons/public-assets-icons/favorite.svg';
import IconfavoriteFilled from '~icons/public-assets-icons/favoriteFilled.svg';

import { compose } from 'recompose';

import {
  BookmarkModel,
  Database,
  ExtractedObservables,
  TableName,
  useDatabase,
  withDatabase,
} from '@workspace/extension-base';
import withObservables from '@nozbe/with-observables';

// interface IToggleBookmark
//   extends ExtractedObservables<ReturnType<typeof getObservables>> {
//   toggleBookmark: () => void;
//   getTooltipText: (test: string) => string;
//   database: Database;
// }

// const getObservables = ({ database }: { database: Database }) => ({
//   bookmark: database.collections.get(TableName.BOOKMARKS).query().observe(),
// });

interface IToggleBookmark {
  toggleBookmark: () => void;
  getTooltipText: (test: string) => string;
  // database: Database;
}

const ToggleBookmark: React.FC<IToggleBookmark> = ({
  toggleBookmark,
  getTooltipText,
}) => {
  const getPageUrl = () => window.location.href;
  const getPageTitle = () => document.title;
  const isBookmarked = false;

  // const database = useDatabase();

  // console.log(database);

  //   const toggle = async () => {
  //     const newB = await database.write(async () => {
  //       const newBookmark = await database
  //         .get<BookmarkModel>(TableName.BOOKMARKS)
  //         .create((bookmark) => {
  //           bookmark.url = window.location.href;
  //           bookmark.title = document.title;
  //         });
  //       return newBookmark;
  //     });
  //     console.log(newB);
  //     return newB;
  //     // database.write(async (writer) => {
  //     //   // const isBookmarked = await database.collections
  //     //   //   .get<BookmarkModel>(TableName.BOOKMARKS)
  //     //   //   .getBookmarkByUrl({ url: getPageUrl() });
  //     //   const test = await writer.callWriter(() => bookmark.createBookmark());
  //     //   const isBookmarked = writer.getBookmarkByUrl({ url: getPageUrl() });
  //     // });
  //     // if (isBookmarked)
  //     //   bookmark.createBookmark({
  //     //     url: getPageUrl(),
  //     //     normalizedUrl: getPageUrl(),
  //     //     title: getPageTitle(),
  //     //   });
  //     // !isBookmarked && bookmark.deleteBookmark({ url: getPageUrl() });
  //   };

  return (
    <SvgTooltipComponent
      iconProps={{
        icon: isBookmarked ? IconFavorite : IconfavoriteFilled,
        className: 'ignore-react-onclickoutside',
      }}
      tooltipProps={{
        tooltipText: getTooltipText('Toggle theme'),
        position: 'leftNarrow',
      }}
      onClick={() => toggleBookmark()}
    />
  );
};

// export default compose(
//   withDatabase,
//   withObservables([], ({ database }: { database: Database }) => ({
//     bookmark: database.get('bookmarks').query(),
//   })),
// )(ToggleBookmark);

export default ToggleBookmark;
// export default withObservables(['database'], getObservables)(ToggleBookmark);

// // // database.collections
// // //   .get<BookmarkModel>(TableName.BOOKMARKS)
// // //   .create((bookmark) => {});

// // // database.write(async writer => {
// // //     const post = await database.get<BookmarkModel>(TableName.BOOKMARKS).find('abcdef')
// // //     //await writer.callWriter(() => post.createBookmark() ,
// // //     await writer.callWriter(() => bookmark.createBookmark()
// // //   })

// // database.write(async (writer) => {
// //   writer.call;
// //   // await database.collections
// //   //   .get<BookmarkModel>(TableName.BOOKMARKS)
// //   //   .createBookmark({});
// // });
