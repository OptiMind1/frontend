import React, { useState } from 'react';

const Community = () => {
  const [activeTab, setActiveTab] = useState("자유게시판");

  const tabs = ["자유게시판", "홍보게시판", "후기모음", "질문게시판"];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">커뮤니티</h2>
      <div className="flex space-x-4 mb-4 border-b">
        {tabs.map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 -mb-px ${
              activeTab === tab 
                ? "border-b-2 border-accent text-accent" 
                : "text-gray-600 hover:text-accent"
            } transition`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="p-4 bg-gray-50 rounded-lg shadow">
        <p className="text-gray-700">
          {activeTab}의 게시글이 여기 표시됩니다.
        </p>
        {/* 댓글 기능 및 게시글 목록 등은 추가 구현 */}
      </div>
    </div>
  );
};

export default Community;
