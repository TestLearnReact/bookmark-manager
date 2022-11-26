import React from 'react';

interface IListItem {
  onScroll: any;
  listInnerRef: any;
  userList: any;
}

const ListItem: React.FC<IListItem> = ({
  onScroll,
  listInnerRef,
  userList,
}) => {
  return (
    <div>
      <div
        onScroll={onScroll}
        ref={listInnerRef}
        style={{ height: '100vh', overflowY: 'auto' }}
      >
        {userList.map((item, index) => {
          return (
            <div
              key={index}
              style={{
                marginTop: '4px',
                display: 'flex',
                flexDirection: 'column',
                padding: '0px 0px 10px 10px',
                borderBottom: '1px solid',

                maxWidth: '98%',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              <p
                style={{
                  margin: 0,
                  padding: '0px 0px 5px 0px',
                }}
              >
                index: {index}
              </p>
              <p
                style={{
                  margin: 0,
                  padding: '0px 0px 5px 0px',
                }}
              >
                Title: {item.title}
              </p>
              <p
                style={{
                  margin: 0,
                  padding: 0,
                }}
              >
                Url: {item.url}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ListItem;
