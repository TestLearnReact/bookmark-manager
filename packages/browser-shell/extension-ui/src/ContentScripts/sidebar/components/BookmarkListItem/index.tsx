import withObservables, { ExtractedObservables } from '@nozbe/with-observables';
import { BookmarkModel } from '@workspace/watermelon-db';
import React from 'react';

interface IBookmarkListItemProps
  extends ExtractedObservables<ReturnType<typeof getObservables>> {
  someOther?: any;
}

const getObservables = ({ bookmark }: { bookmark: BookmarkModel }) => ({
  bookmark: bookmark.observe(),
});

const BookmarkListItem: React.FC<IBookmarkListItemProps> = ({ bookmark }) => {
  if (!bookmark) return <>Empty...</>;

  return (
    <div>
      id: {bookmark._raw.id}
      <br />
      url: {bookmark.url}
      <br />
      title: {bookmark.title}
      <div
        style={{
          height: '1px',
          backgroundColor: 'black',
          margin: '0 5px',
        }}
      />
    </div>
  );
};

export default withObservables(['bookmark'], getObservables)(BookmarkListItem);
