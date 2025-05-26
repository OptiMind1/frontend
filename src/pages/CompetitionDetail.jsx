import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useUser } from "../contexts/UserContext";

const categoryDetails = {
  "창업": ["기획", "BM 설계", "IR 자료 디자이너", "피칭 발표"],
  "아이디어": ["문제 정의/리서처", "아이디어 브레인스토머", "자료 조사", "아이디어 시각화"],
  "슬로건": ["카피라이터", "기획", "표현력/언어 감수"],
  "네이밍": ["네이머", "기획"],
  "마케팅": ["마케팅 전략/기획", "SNS 콘텐츠 기획", "광고 문구/자료 제작", "성과 분석"],
  "사진": ["사진 촬영자", "보정 및 후보정 담당", "촬영 기획"],
  "영상": ["영상 촬영", "영상 편집", "모션그래픽 디자이너", "스토리보드 기획"],
  "포스터": ["포스터 디자이너", "홍보 콘텐츠 디자이너"],
  "로고": ["로고 디자이너", "브랜드 기획"],
  "상품": ["제품 디자인 기획", "패키지 디자이너"],
  "캐릭터": ["캐릭터 디자이너", "스토리텔링 기획"],
  "그림": ["일러스트레이터", "기획"],
  "웹툰": ["스토리 작가", "컷 작화", "채색 담당"],
  "광고": ["광고 이미지 기획", "카피라이팅 담당자"],
  "도시건축": ["공공 인포그래픽 디자이너", "공간 기획 디자이너"],
  "논문": ["논문 주제 기획", "자료 조사", "논문 작성"],
  "수기": ["수기/에세이 작가", "개인 경험 콘텐츠 기획"],
  "시": ["시 창작", "감성 문장 편집자"],
  "시나리오": ["시나리오 작가", "캐릭터 설정", "스토리 구조 기획"],
  "공학": ["설계 아이디어 기획", "도면/시뮬레이션 제작", "기술 문서 작성"],
  "과학": ["실험 기획", "데이터 수집/분석", "보고서 작성"],
  "음악": ["작곡/편곡", "연주/보컬", "음향 믹싱"],
  "댄스": ["안무 기획", "무대 연출", "영상 촬영/편집"],
  "e스포츠": ["전략 분석", "게이머", "중계/해설"]
};

const Button = ({ children, className = "", ...props }) => (
  <button {...props} type={props.type || "button"} className={`px-4 py-2 rounded ${className}`}>
    {children}
  </button>
);

export default function CompetitionDetail() {
  const { id } = useParams();
  const { user } = useUser();

  const [competition, setCompetition] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [applicantType, setApplicantType] = useState("");
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedTeamMembers, setSelectedTeamMembers] = useState([]);
  const [memberInterests, setMemberInterests] = useState({});
  const [mainCategories, setMainCategories] = useState({});
  const [teamSize, setTeamSize] = useState("");

  useEffect(() => {
    const mockCompetition = {
      id,
      title: "AI 창업 공모전 2025",
      description: "AI 기술을 활용한 창업 아이디어를 공모합니다.",
      period: "2025.06.01 ~ 2025.07.31",
      benefits: "총 상금 1,000만원 / 창업지원 / 멘토링 제공",
    };

    const mockUsers = [
      { id: "user1", username: "홍길동" },
      { id: "user2", username: "김영희" },
      { id: "user3", username: "박철수" },
    ];

    setTimeout(() => {
      setCompetition(mockCompetition);
      setUsers(mockUsers);
      setIsLoading(false);
    }, 300);
  }, [id]);

  const closeModal = () => {
    setShowTeamModal(false);
    setApplicantType("");
    setSelectedTeamMembers([]);
    setSearch("");
    setMemberInterests({});
    setMainCategories({});
    setTeamSize("");
  };

  const handleTeamSubmit = async () => {
    if (!applicantType) return alert("지원 방식을 선택해주세요.");

    if (applicantType === "개인") {
      if (!memberInterests[user.id]) return alert("관심 분야를 선택해주세요.");
      const payload = {
        competitionId: competition.id,
        applicantType,
        members: [{ id: user.id, interest: memberInterests[user.id] }],
      };
      await axios.post("/api/team-match/apply", payload);
      alert("✅ 신청 완료!");
      closeModal();
    } else {
      if (selectedTeamMembers.length === 0) return alert("팀원을 선택해주세요.");
      const incomplete = selectedTeamMembers.some((id) => !memberInterests[id]);
      if (incomplete) return alert("모든 팀원의 관심 분야를 선택해주세요.");

      const members = selectedTeamMembers.map((id) => ({
        id,
        interest: memberInterests[id],
      }));

      const payload = {
        competitionId: competition.id,
        applicantType,
        members,
      };

      await axios.post("/api/team-match/apply", payload);
      alert("✅ 신청 완료!");
      closeModal();
    }
  };

  if (isLoading) return <div>로딩 중...</div>;

  const renderInterestButtons = (userId) => {
    const selectedMain = mainCategories[userId];
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          {Object.keys(categoryDetails).map((main) => (
            <button
              key={main}
              onClick={() => setMainCategories({ ...mainCategories, [userId]: main })}
              className={`border px-3 py-1 rounded text-sm ${
                selectedMain === main ? "border-sky-500 bg-sky-50 text-sky-700 font-semibold" : "border-gray-300"
              }`}
            >
              {main}
            </button>
          ))}
        </div>

        {selectedMain && categoryDetails[selectedMain]?.length > 0 && (
          <div className="pt-2 border-t">
            <h4 className="text-sm font-semibold text-sky-700 mb-1">세부 분야 선택</h4>
            <div className="grid grid-cols-2 gap-2">
              {categoryDetails[selectedMain].map((item) => (
                <button
                  key={item}
                  onClick={() => setMemberInterests({ ...memberInterests, [userId]: item })}
                  className={`border px-3 py-1 rounded text-sm ${
                    memberInterests[userId] === item ? "border-sky-500 bg-sky-100 text-sky-700 font-semibold" : "border-gray-300"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">{competition.title}</h1>
      <button onClick={() => setShowTeamModal(true)} className="bg-blue-500 text-white px-4 py-2 rounded">
        팀매칭 신청
      </button>

      <AnimatePresence>
        {showTeamModal && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={closeModal}>
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="bg-white p-6 rounded-xl shadow-lg w-[450px] space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-xl font-bold text-sky-700">팀매칭 신청</h2>

              <div>
                <label className="block text-sm font-semibold mb-1">지원 방식</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="applicantType" value="개인" checked={applicantType === "개인"} onChange={(e) => setApplicantType(e.target.value)} /> 개인
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="applicantType" value="팀" checked={applicantType === "팀"} onChange={(e) => setApplicantType(e.target.value)} /> 팀
                  </label>
                </div>
              </div>

              {applicantType === "개인" && (
                <div>
                  <label className="block text-sm font-semibold mt-2 mb-1">신청자 정보</label>
                  <div className="mb-2 p-2 border rounded bg-gray-50 text-sm text-gray-700">
                    {user.username} ({user.id})
                  </div>

                  <label className="block text-sm font-semibold mt-2 mb-1">관심 분야</label>
                  {renderInterestButtons(user.id)}
                </div>
              )}

              {applicantType === "팀" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">팀 인원수</label>
                    <input
                      type="number"
                      value={teamSize}
                      onChange={(e) => setTeamSize(e.target.value)}
                      min={1}
                      className="w-full border rounded px-2 py-1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1">팀원 검색</label>
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="아이디 또는 이름 검색"
                      className="w-full border rounded px-2 py-1"
                    />
                  </div>

                  <div className="border rounded max-h-32 overflow-y-auto p-2 space-y-1">
                    {users
                      .filter((u) => u.username.includes(search) || u.id.includes(search))
                      .map((user) => {
                        const isDisabled = teamSize && selectedTeamMembers.length >= parseInt(teamSize);
                        const alreadySelected = selectedTeamMembers.includes(user.id);

                        return (
                          <button
                            key={user.id}
                            onClick={() => {
                              if (isDisabled) {
                                alert("입력한 팀 인원수를 초과할 수 없습니다.");
                                return;
                              }
                              if (!alreadySelected) {
                                setSelectedTeamMembers([...selectedTeamMembers, user.id]);
                              }
                            }}
                            disabled={isDisabled || alreadySelected}
                            className={`block w-full text-left px-2 py-1 rounded ${
                              isDisabled || alreadySelected
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : "hover:bg-sky-100"
                            }`}
                          >
                            {user.username} ({user.id})
                          </button>
                        );
                      })}
                  </div>

                  {selectedTeamMembers.map((id) => (
                    <div key={id} className="bg-gray-50 border rounded p-2">
                      <div className="flex justify-between items-center mb-2">
                        <span>{id}</span>
                        <button
                          onClick={() => {
                            setSelectedTeamMembers(selectedTeamMembers.filter((uid) => uid !== id));
                            const copy = { ...memberInterests };
                            delete copy[id];
                            setMemberInterests(copy);
                          }}
                          className="text-red-500"
                        >×</button>
                      </div>
                      {renderInterestButtons(id)}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4">
                <Button onClick={closeModal} className="border border-gray-300">취소</Button>
                <Button onClick={handleTeamSubmit} className="bg-sky-500 text-white">신청</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
