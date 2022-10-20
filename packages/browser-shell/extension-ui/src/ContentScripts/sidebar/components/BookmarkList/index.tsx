// import React from 'react';
// import {
//   BookmarkModel,
//   Database,
//   ExtractedObservables,
//   Q,
//   Query,
//   TableName,
//   useDatabase,
//   withDatabase,
// } from '@workspace/extension-base';
// import withObservables from '@nozbe/with-observables';
// import BookmarkListItem from '../BookmarkListItem';
// import { compose } from 'recompose';

// interface IProps {
//   bookmarks: any;
// }

// // interface IProps
// //   extends ExtractedObservables<ReturnType<typeof getObservables>> {
// //   bookmarkQuery?: Query<BookmarkModel>;
// // }

// // const getObservables = ({ database }: { database: Database }) => {
// //   console.log('..............');
// //   return {
// //     bookmarks: database.collections
// //       .get<BookmarkModel>(TableName.BOOKMARKS)
// //       .query()
// //       .observe(),

// //     f: database.get<BookmarkModel>(TableName.BOOKMARKS).query().observe(),
// //   };
// // };

// // const getObservables = ({ database }: { database: Database }) => ({
// //   bookmarks: database.collections
// //     .get<BookmarkModel>(TableName.BOOKMARKS)
// //     .query()
// //     .observe(),
// // });

// const BookmarkList: React.FC<IProps> = ({ bookmarks }) => {
//   return (
//     <>
//       <div className='list' style={{ height: '96%', overflowY: 'auto' }}>
//         {bookmarks.map((bookmark) => (
//           <BookmarkListItem key={bookmark._raw.id} bookmark={bookmark} />
//         ))}
//       </div>
//     </>
//   );
// };

// export default BookmarkList;
// // export default withObservables([], getObservables)(BookmarkList);

// // export default compose(
// //   withDatabase,
// //   withObservables([], ({ database }: { database: Database }) => ({
// //     bookmarks: database.get('bookmarks').query(),
// //   })),
// // )(BookmarkList);

// // export default compose(
// //   withDatabase,
// //   withObservables(['database'], getObservables),
// // )(BookmarkList);
