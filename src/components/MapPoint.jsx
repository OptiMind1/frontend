import React from 'react';

const MapPoint = ({ point, onClick }) => {
  return (
    <div
      className="absolute w-4 h-4 bg-red-500 rounded-full cursor-pointer animate-ping"
      style={{ top: point.top, left: point.left }}
      onClick={onClick}
    />
  );
};

export default MapPoint;
