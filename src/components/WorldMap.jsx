import React from 'react';
import worldMapImage from '../assets/images/worldmap.svg';

const points = [
  { id: 'section-1', name: 'first', top: '29%', left: '90%' },
  { id: 'section-2', name: 'second', top: '14%', left: '66%' },
  { id: 'section-3', name: 'third', top: '21%', left: '19%' },
  { id: 'section-4', name: 'fourth', top: '62%', left: '30%' },
  { id: 'section-5', name: 'fifth', top: '48%', left: '55%' },
];

const WorldMap = ({ onPointClick }) => {
  return (
    <div className="relative w-full max-w-7xl mx-auto">
      {/* 배경이미지 처리 */}
      <div
        className="w-full h-[300px] md:h-[500px] lg:h-[700px] bg-center bg-cover bg-no-repeat rounded-lg shadow-md"
        style={{ backgroundImage: `url(${worldMapImage})` }}
      />

      {/* 포인트 위치 */}
      {points.map((point) => (
        <div
          key={point.id}
          className="absolute cursor-pointer"
          style={{ top: point.top, left: point.left, transform: 'translate(-50%, -50%)' }}
          onClick={() => onPointClick(point.id)}
        >
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-ping"></div>
          <div className="w-4 h-4 bg-blue-700 rounded-full"></div>
        </div>
      ))}
    </div>
  );
};

export default WorldMap;
