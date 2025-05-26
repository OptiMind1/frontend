// ContestCard.js
import React from 'react';

const ContestCard = ({ contest, onClickDetail, onTeamMatch }) => (
  <div
    className="p-6 bg-white shadow-lg transform transition hover:scale-105 cursor-pointer"
    style={{
      borderRadius: '50% / 20%', /* 비행기 창문 같은 타원형 */
      border: '3px solid #BFDBFE' /* 연한 하늘색 테두리 */
    }}
  >
    <h3 className="text-xl font-semibold mb-2 text-gray-800">{contest.title}</h3>
    <p className="text-sm text-gray-600 mb-4">{contest.category}</p>
    <p className="text-gray-700 mb-4 line-clamp-3">{contest.description}</p>
    <div className="flex space-x-4">
      <button onClick={() => onClickDetail(contest)} className="text-sky-500 hover:underline">
        상세보기
      </button>
      <button onClick={() => onTeamMatch(contest)} className="text-sky-500 hover:underline">
        팀매칭 신청
      </button>
    </div>
  </div>
);

export default ContestCard;