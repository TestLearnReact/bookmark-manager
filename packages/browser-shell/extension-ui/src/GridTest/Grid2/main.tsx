import React, { useEffect, useRef, useState } from 'react';
import perfectLayout from '.';

import './style.css';

const STYLE_WRAPPER: React.CSSProperties = {
  overflow: 'auto',
  willChange: 'transform',
  WebkitOverflowScrolling: 'touch',
};

const STYLE_INNER: React.CSSProperties = {
  position: 'relative',
  width: '100%',
  minHeight: '100%',
};

interface IGridProps {
  gridElements: any[];
  width: number;
  height: number;
}

export const Gallery2: React.FC<IGridProps> = ({
  gridElements,
  width,
  height,
}) => {
  const refGridElements = useRef<null | any>(null);

  useEffect(() => {
    const perfectRows = perfectLayout(gridElements, width, height, {
      // default options
      margin: 0,
    });
    refGridElements.current = perfectRows;
  }, []);

  if (!refGridElements.current) return null;

  console.log('grid 2', refGridElements.current);

  const items = refGridElements.current.map((row, ir) => {
    return row.map((img, ii) => (
      <div
        key={ir + ii}
        className='image'
        style={{
          width: img.width + 'px',
          height: img.height + 'px',
          background: 'url(' + img.src + ')',
          backgroundSize: 'cover',
        }}
      ></div>
    ));
  });

  return (
    <div id='gallery' className='outerWrapper' style={{ ...STYLE_WRAPPER }}>
      <div className='innerWrapper' style={{ ...STYLE_INNER }}>
        {items}
      </div>
    </div>
  );
};
