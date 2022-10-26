import React from 'react';
import {
  BookmarkModel,
  Database,
  TableName,
  ExtractedObservables,
} from '@workspace/watermelon-db';
import withObservables from '@nozbe/with-observables';
import BookmarkListItem from '../BookmarkListItem';

interface IBookmarkListProps
  extends ExtractedObservables<ReturnType<typeof getObservables>> {
  bookmarks: BookmarkModel[];
}

const getObservables = ({ database }: { database: Database }) => ({
  bookmarks: database.collections
    .get<BookmarkModel>(TableName.BOOKMARKS)
    .query()
    .observe(),
});

const BookmarkList: React.FC<IBookmarkListProps> = ({ bookmarks }) => {
  return (
    <>
      <div className='list' style={{ height: '100%', overflowY: 'auto' }}>
        {bookmarks.map((bookmark) => (
          <BookmarkListItem key={bookmark._raw.id} bookmark={bookmark} />
        ))}
      </div>
    </>
  );
};

export default withObservables([], getObservables)(BookmarkList);

/**
 *
 *
 *
 */
// import { compose } from 'recompose';

// export default compose(
//   withDatabase,
//   withObservables([], ({ database }: { database: Database }) => ({
//     bookmarks: database.get('bookmarks').query(),
//   })),
// )(BookmarkList);

// export default compose(
//   withDatabase,
//   withObservables(['database'], getObservables),
// )(BookmarkList);
