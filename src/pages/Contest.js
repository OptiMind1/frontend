import React, { useState } from 'react';
import ContestDetailModal from '../components/ContestDetailModal';

const sampleContests = [
  { id: 1, title: "AI 창의 아이디어 공모전", type: "공모전", category: "2025.03.01 ~ 2025.04.15 [12/50]", description: "AI 기반 창의 아이디어 제안 및 구현 공모전입니다." },
  { id: 2, title: "글로벌 인턴십 프로그램", type: "대외활동", category: "2025.05.01 ~ 2025.08.31 [18/30]", description: "해외 기업과 연계된 단기 인턴십 프로그램." },
  { id: 3, title: "소셜임팩트 해커톤", type: "공모전", category: "2025.04.10 ~ 2025.04.12 [7/40]", description: "사회문제를 해결하기 위한 48시간 해커톤." },
  { id: 4, title: "문화교류 서포터즈", type: "대외활동", category: "2025.06.01 ~ 2025.08.30 [20/40]", description: "외국인 유학생과 함께하는 한국 문화 교류 활동." },
  { id: 5, title: "친환경 기술 개발 공모전", type: "공모전", category: "2025.07.01 ~ 2025.08.01 [10/50]", description: "환경문제 해결을 위한 기술 아이디어 제안." },
  { id: 6, title: "스타트업 체험활동", type: "대외활동", category: "2025.04.01 ~ 2025.07.31 [25/30]", description: "스타트업 현장에서 직접 업무를 체험할 수 있는 기회." },
  { id: 7, title: "UX/UI 디자인 공모전", type: "공모전", category: "2025.06.10 ~ 2025.07.15 [13/40]", description: "앱/웹 기반 UX 디자인 공모." },
  { id: 8, title: "글로벌 서포터즈 활동", type: "대외활동", category: "2025.05.10 ~ 2025.07.30 [15/25]", description: "국제 행사 및 교류 관련 활동." },
  { id: 9, title: "데이터 시각화 챌린지", type: "공모전", category: "2025.04.15 ~ 2025.05.30 [18/40]", description: "데이터를 시각화하는 프로젝트 공모전." },
  { id: 10, title: "한국어 멘토링 프로그램", type: "대외활동", category: "2025.03.20 ~ 2025.06.20 [30/30]", description: "외국인을 위한 한국어 학습 멘토링." },
  { id: 11, title: "해외문학 번역 공모전", type: "공모전", category: "2025.07.01 ~ 2025.08.31 [9/20]", description: "외국 문학을 한국어로 번역하는 공모전." },
  { id: 12, title: "세계 시민 캠페인", type: "대외활동", category: "2025.08.01 ~ 2025.09.30 [16/25]", description: "세계 시민으로서의 책임과 역할을 실천하는 캠페인." }
];

const Contest = () => {
  const [filter, setFilter] = useState("전체");
  const [search, setSearch] = useState("");
  const [selectedContest, setSelectedContest] = useState(null);

  const filteredContests = sampleContests.filter(item => {
    const matchesFilter = filter === "전체" || item.type === filter;
    const matchesSearch = item.title.includes(search) || item.description.includes(search);
    return matchesFilter && matchesSearch;
  });

  const handleClickDetail = (contest) => {
    setSelectedContest(contest);
  };

  const handleTeamMatch = (contest) => {
    alert(`${contest.title} 팀매칭 신청 완료!`);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">공모전 & 대외활동</h2>

      {/* 검색 + 필터 */}
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0">
        <input
          type="text"
          placeholder="공모전/대외활동 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border border-gray-300 rounded-md w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-sky-400"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400"
        >
          <option value="전체">전체</option>
          <option value="공모전">공모전</option>
          <option value="대외활동">대외활동</option>
        </select>
      </div>

      {/* 카드 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContests.map(contest => (
          <div
              key={contest.id}
              className="group relative w-full h-[500px] max-w-[400px] rounded-3xl bg-sky-200 text-center font-bold text-lg text-gray-800 cursor-pointer overflow-hidden transition-transform duration-300 hover:scale-105 mx-auto shadow-lg"
              onClick={() => handleClickDetail(contest)}
            >
        
        
            <div className="absolute inset-0 flex items-center justify-center text-xl transition-opacity duration-300 group-hover:opacity-0">
              {contest.title}
            </div>

            <div className="absolute inset-0 bg-white bg-opacity-80 opacity-0 hover:opacity-100 transition-opacity duration-300 p-6 flex flex-col justify-between rounded-3xl">
              <h3 className="font-semibold text-lg mb-2">{contest.title}</h3>
              <p className="text-sm mb-1">{contest.category}</p>
              <p className="text-sm mb-2">{contest.description}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleClickDetail(contest);
                }}
                className="mt-auto bg-sky-500 text-white px-3 py-1 rounded hover:bg-sky-600"
              >
                상세보기
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleTeamMatch(contest);
                }}
                className="mt-2 bg-sky-400 text-white px-3 py-1 rounded hover:bg-sky-500"
              >
                팀매칭 신청
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedContest && (
        <ContestDetailModal
          contest={selectedContest}
          onClose={() => setSelectedContest(null)}
        />
      )}
    </div>
  );
};

export default Contest;
