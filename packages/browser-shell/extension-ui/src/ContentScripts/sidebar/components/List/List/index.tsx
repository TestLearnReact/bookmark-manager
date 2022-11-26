import useVirtualScroll from '../hooks/useVirtualScroll';

// https://codesandbox.io/s/react-virtual-scroll-hook-nhzkrc?file=/src/index.js:100-125

const dummyArray = Array.from({ length: 10000 }, (v, i) => i);

// configuration
const VIRTUAL_SCROLL_SETTINGS = {
  styles: {
    height: 50,
  },
  virtualStartIndex: 5,
  sliceAmount: 50,
  maxIndex: 300,
  dataFetchTriggerIndex: 50,
};

const template = (
  startIndex,
  sliceAmount = VIRTUAL_SCROLL_SETTINGS.sliceAmount,
) => {
  return dummyArray.slice(startIndex, startIndex + sliceAmount).map((item) => {
    return <div key={item}>{item}</div>;
  });
};

export const ListTest1 = () => {
  const itemHeight = VIRTUAL_SCROLL_SETTINGS.styles.height;
  const { isLoading, onScrollHandler, translateYValue, dataList } =
    useVirtualScroll({
      settings: VIRTUAL_SCROLL_SETTINGS,
      itemHeight: VIRTUAL_SCROLL_SETTINGS.styles.height,
      templateGetter: template,
      dataFetch: null,
    });

  return (
    <>
      <div
        onScroll={(e) => onScrollHandler(e)}
        style={{
          maxHeight: 400,
          overflow: 'scroll',
          backgroundColor: 'white',
        }}
      >
        <div
          className='viewport'
          style={{
            height:
              VIRTUAL_SCROLL_SETTINGS.styles.height *
                VIRTUAL_SCROLL_SETTINGS.maxIndex +
              (isLoading ? itemHeight : 0),
          }}
        >
          <div
            className='scrollArea'
            style={{
              willChange: 'transform',
              transform: `translateY(${translateYValue}px)`,
            }}
          >
            {dataList}
          </div>
        </div>
      </div>
    </>
  );
};

// import React, { useRef, useEffect, useState } from 'react';

// import {
//   BookmarkModel,
//   Database,
//   TableName,
//   ExtractedObservables,
//   withObservables,
//   TabPositionModel,
// } from '@workspace/extension-base';

// import ListItem from '../ListItem';

// // https://codesandbox.io/s/epic-galois-7313fe?file=/ListingPage/ListingPageContainer/ListingPageContainer.jsx
// // https://dev.to/jealousgx/build-a-responsive-sidebar-with-react-and-styled-components-4e9e

// const getObservables = ({ database }: { database: Database }) => ({
//   list: database.collections
//     .get<TabPositionModel>(TableName.TAB_POSITIONS)
//     .query()
//     .observe(),
// });

// type IList = ExtractedObservables<ReturnType<typeof getObservables>>;

// const List: React.FC<IList> = (props) => {
//   const listInnerRef = useRef();
//   const [currPage, setCurrPage] = useState<number>(1);
//   const [prevPage, setPrevPage] = useState<number>(0);
//   const [userList, setUserList] = useState<any[]>([]);
//   const [lastList, setLastList] = useState<boolean>(false);

//   useEffect(() => {
//     const fetchData = async () => {
//       //   const response = await axios.get(
//       //     `https://api.instantwebtools.net/v1/passenger?page=${currPage}&size=10`,
//       //   );
//       const response = props.list;

//       console.log(response, '<<<');
//       if (!response.length) {
//         setLastList(true);
//         return;
//       }

//       setPrevPage(currPage);
//       setUserList([...userList, ...response]);
//     };
//     if (!lastList && prevPage !== currPage) {
//       fetchData();
//     }
//   }, [currPage, lastList, prevPage, userList]);

//   const onScroll = () => {
//     if (listInnerRef.current) {
//       const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
//       if (scrollTop + clientHeight === scrollHeight) {
//         setCurrPage(currPage + 1);
//       }
//     }
//   };

//   return (
//     <ListItem
//       onScroll={onScroll}
//       listInnerRef={listInnerRef}
//       userList={userList}
//     />
//   );
// };

// export default withObservables([], getObservables)(List);
