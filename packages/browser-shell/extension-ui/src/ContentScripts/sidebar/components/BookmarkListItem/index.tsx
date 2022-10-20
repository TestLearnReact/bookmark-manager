// import withObservables, { ExtractedObservables } from '@nozbe/with-observables';
// import { BookmarkModel } from '@workspace/extension-base';
// import React from 'react';

// interface BookmarkListProps
//   extends ExtractedObservables<ReturnType<typeof getObservables>> {
//   someOther?: any;
// }

// const getObservables = ({ bookmark }: { bookmark: BookmarkModel }) => ({
//   bookmark: bookmark.observe(),
// });

// const BookmarkListItem: React.FC<BookmarkListProps> = ({ bookmark }) => {
//   if (!bookmark) return <>Empty...</>;

//   return (
//     <div>
//       id: {bookmark._raw.id}
//       <br />
//       url: {bookmark.url}
//     </div>
//   );
// };

// export default withObservables(['bookmark'], getObservables)(BookmarkListItem);
