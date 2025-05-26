import React from 'react';

const InfoOverlay = ({ point, onClose }) => {
  return (
    <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-10">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md text-center animate-scale-up">
        <h2 className="text-2xl font-bold mb-4">{point.name}</h2>
        <p className="text-gray-700 mb-4">
          {point.name} 페이지에 대한 간단한 소개를 여기에 작성합니다.
        </p>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          닫기
        </button>
      </div>
    </div>
  );
};

export default InfoOverlay;
