import React from 'react';

const ContestDetailModal = ({ contest, onClose }) => {
  if (!contest) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-4">{contest.title}</h2>
        <p className="text-gray-700 mb-4">{contest.description}</p>
        <div className="flex justify-end space-x-2">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition"
          >
            닫기
          </button>
          <button 
            onClick={() => alert("신청 완료! 추후 AI 팀매칭 결과를 알려드립니다.")}
            className="px-4 py-2 rounded bg-accent text-white hover:bg-accent/80 transition"
          >
            신청
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContestDetailModal;
