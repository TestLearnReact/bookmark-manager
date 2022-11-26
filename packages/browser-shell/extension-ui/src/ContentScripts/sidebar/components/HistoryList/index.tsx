import React from 'react';
import {
  BookmarkModel,
  Database,
  TableName,
  ExtractedObservables,
  withObservables,
  TabPositionModel,
} from '@workspace/extension-base';
// import withObservables from '@nozbe/with-observables';

type IHistoryListProps = ExtractedObservables<
  ReturnType<typeof getObservables>
>;

const getObservables = ({ database }: { database: Database }) => ({
  tabPositions: database.collections
    .get<TabPositionModel>(TableName.TAB_POSITIONS)
    .query()
    .observe(),
});

const HistoryList: React.FC<IHistoryListProps> = ({ tabPositions }) => {
  console.log('pos......', tabPositions);
  return (
    <>
      <div className='list' style={{ height: '100%', overflowY: 'auto' }}>
        {tabPositions.map((pos, i) => (
          <HistoryListItem key={pos._raw.id} historyItem={pos} index={i} />
        ))}
      </div>
    </>
  );
};

export default withObservables([], getObservables)(HistoryList);

const HistoryListItem: React.FC<{ historyItem: any; index: number }> = ({
  historyItem,
  index,
}) => {
  return (
    <>
      .. Item: {index}
      <br />
      .. {historyItem.title}
      <div
        style={{
          height: '1px',
          backgroundColor: 'black',
          margin: '0 5px',
        }}
      />
    </>
  );
};
