import React, { memo, useState } from 'react';
import ReactDOM from 'react-dom';
import VirtualScroll from './virtual';
import './styles.css';

// usage:
export const Item = memo(({ index }) => (
  <div
    style={{
      height: 30,
      lineHeight: '30px',
      display: 'flex',
      justifyContent: 'space-between',
      padding: '0 10px',
    }}
    className='row'
    key={index}
  >
    {/* <img
      alt={index}
      src={`https://picsum.photos/id/${(index % 10) + 1}/200/300`}
    /> */}
    row index {index}
  </div>
));

export const ListTest2 = () => {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div className='App'>
      <h1>Virtual Scroll</h1>
      <input
        type='checkbox'
        onChange={(e) => setIsVisible((prev) => !prev)}
        checked={isVisible}
      />
      {isVisible ? (
        <VirtualScroll
          itemCount={10000}
          height={300}
          childHeight={30}
          Item={Item}
        />
      ) : null}
      <hr />
    </div>
  );
};
