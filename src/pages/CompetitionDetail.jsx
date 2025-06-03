import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useUser } from "../contexts/UserContext";
import publicApi from "../api_public";

const roleOptions = [
  "기획", "디자이너", "UX/UI 설계자", "촬영/감독",
  "영상 편집자", "사진 후보정자", "발표자/피칭", "분석/리서처",
  "자료 조사", "데이터 수집/분석", "문서화 담당자", "브랜딩/마케팅",
  "통역/언어", "프론트엔드 개발자", "백엔드 개발자", "AI/데이터 개발자",
  "음향/음악 담당자", "게이머/플레이어", "연출/무대기획자"
];

const Button = ({ children, className = "", ...props }) => (
  <button
    {...props}
    type={props.type || "button"}
    className={`px-4 py-2 rounded ${className}`}
  >
    {children}
  </button>
);

export default function CompetitionDetail() {
  const { id } = useParams();
  const { user } = useUser();

  const [competition, setCompetition] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [detailInfo, setDetailInfo] = useState(null);

  // “실제 화면에 보여 줄 제목”만 담을 상태
  const [detailTitle, setDetailTitle] = useState("");

  const [showTeamModal, setShowTeamModal] = useState(false);
  const [applicantType, setApplicantType] = useState("");
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedTeamMembers, setSelectedTeamMembers] = useState([]);
  const [memberRoles, setMemberRoles] = useState({});
  const [teamSize, setTeamSize] = useState("");

  // 1) competition 데이터를 불러와서 state에 저장
  useEffect(() => {
    publicApi.get(`/api/competition/${id}/`)
      .then((res) => {
        setCompetition(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("상세 정보 불러오기 실패", err);
        setIsLoading(false);
      });
  }, [id]);

  // 2) competition.link가 있으면, 상세 크롤링 API 호출
  useEffect(() => {
    if (!competition || !competition.link) return;

    const fetchDetailInfo = async () => {
      try {
        // URL을 encodeURIComponent로 인코딩
        const encodedUrl = encodeURIComponent(competition.link);
        const res = await publicApi.get(
          `/api/competition/crawl/detail/?url=${encodedUrl}`
        );
        setDetailInfo(res.data);
      } catch (err) {
        console.error("상세 크롤링 실패", err);
      }
    };

    fetchDetailInfo();
  }, [competition]);

  // 3) detailInfo.description(HTML 전체)가 바뀔 때마다 “<b>…</b>” 안의 텍스트만 추출
  useEffect(() => {
    if (!detailInfo || !detailInfo.description) return;

    // 임시로 DOM 형태로 만들어서 <b> 태그를 찾아보기
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = detailInfo.description;

    // 올콘 상세 페이지에서 제목은 <b> 태그 안에 들어있습니다.
    const bTag = tempDiv.querySelector("b");
    if (bTag && bTag.textContent) {
      // “조이시티 공식 크리에이터 - 조이크루” 이런 식으로 나옴
      setDetailTitle(bTag.textContent.trim());
    } else {
      // 혹시 없으면, 백엔드에서 가져온 competition.title 을 대체 사용
      setDetailTitle(competition?.title || "");
    }
  }, [detailInfo, competition]);

  const closeModal = () => {
    setShowTeamModal(false);
    setApplicantType("");
    setSelectedTeamMembers([]);
    setSearch("");
    setMemberRoles({});
    setTeamSize("");
  };

  const handleTeamSubmit = async () => {
    if (!applicantType) {
      alert("지원 방식을 선택해주세요.");
      return;
    }

    if (applicantType === "개인") {
      if (!memberRoles[user.id]) {
        alert("역할을 선택해주세요.");
        return;
      }
      const payload = {
        competitionId: competition.id,
        applicantType,
        members: [{ id: user.id, role: memberRoles[user.id] }],
      };
      await axios.post("/api/team-match/apply", payload);
      alert("✅ 신청 완료!");
      closeModal();
    } else {
      if (selectedTeamMembers.length === 0) {
        alert("팀원을 선택해주세요.");
        return;
      }
      const incomplete = selectedTeamMembers.some((uid) => !memberRoles[uid]);
      if (incomplete) {
        alert("모든 팀원의 역할을 선택해주세요.");
        return;
      }

      const members = selectedTeamMembers.map((uid) => ({
        id: uid,
        role: memberRoles[uid],
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

  const renderRoleButtons = (userId) => (
    <div className="grid grid-cols-2 gap-2">
      {roleOptions.map((role) => (
        <button
          key={role}
          onClick={() => setMemberRoles({ ...memberRoles, [userId]: role })}
          className={`border px-3 py-1 rounded text-sm ${
            memberRoles[userId] === role
              ? "border-sky-500 bg-sky-100 text-sky-700 font-semibold"
              : "border-gray-300"
          }`}
        >
          {role}
        </button>
      ))}
    </div>
  );

  if (isLoading) return <div>로딩 중...</div>;
  if (!competition) return <div>공모전 정보를 불러오지 못했습니다.</div>;

  return (
    <div className="p-8">
      {/* 1) 제목 부분: detailTitle(추출된 <b> 태그 내용) 또는 fallback으로 competition.title */}
      <h1 className="text-2xl font-bold mb-4">
        {detailTitle || competition.title}
      </h1>

      {/* 팀매칭 신청 버튼 */}
      <button
        onClick={() => {
          if (!user || !user.id) {
            alert("로그인 후 이용해주세요.");
            return;
          }
          setShowTeamModal(true);
        }}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-6"
      >
        팀매칭 신청
      </button>

      {/* 2) 포스터 이미지 (이미지 URL이 있으면 노출) */}
      {detailInfo && detailInfo.image_url && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">포스터</h2>
          <img
            src={detailInfo.image_url}
            alt="공모전 포스터"
            className="max-w-md rounded border"
          />
        </div>
      )}

      {/* 3) 상세 설명(HTML) */}
      {detailInfo && detailInfo.description && (
        <div className="mt-8 space-y-6">
          <h2 className="text-lg font-semibold mb-2">상세 설명</h2>
          <div
            className="prose prose-lg"
            dangerouslySetInnerHTML={{ __html: detailInfo.description }}
          />
        </div>
      )}

      {/* 4) 팀 매칭 모달(이하 생략) */}
      <AnimatePresence>
        {showTeamModal && (
          <div
            className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
            onClick={closeModal}
          >
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
                    <input
                      type="radio"
                      name="applicantType"
                      value="개인"
                      checked={applicantType === "개인"}
                      onChange={(e) => setApplicantType(e.target.value)}
                    />
                    개인
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="applicantType"
                      value="팀"
                      checked={applicantType === "팀"}
                      onChange={(e) => setApplicantType(e.target.value)}
                    />
                    팀
                  </label>
                </div>
              </div>

              {applicantType === "개인" && (
                <div>
                  <label className="block text-sm font-semibold mt-2 mb-1">
                    신청자 정보
                  </label>
                  <div className="mb-2 p-2 border rounded bg-gray-50 text-sm text-gray-700">
                    {user.username} ({user.id})
                  </div>
                  <label className="block text-sm font-semibold mt-2 mb-1">
                    역할 선택
                  </label>
                  {renderRoleButtons(user.id)}
                </div>
              )}

              {applicantType === "팀" && (
                <div className="space-y-4">
                  <label className="block text-sm font-semibold mb-1">팀 인원수</label>
                  <input
                    type="number"
                    value={teamSize}
                    onChange={(e) => setTeamSize(e.target.value)}
                    min={1}
                    className="w-full border rounded px-2 py-1"
                  />

                  <label className="block text-sm font-semibold mb-1">팀원 검색</label>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="아이디 또는 이름 검색"
                    className="w-full border rounded px-2 py-1"
                  />

                  <div className="border rounded max-h-32 overflow-y-auto p-2 space-y-1">
                    {users
                      .filter(
                        (u) =>
                          u.username.includes(search) ||
                          String(u.id).includes(search)
                      )
                      .map((u) => {
                        const isDisabled =
                          teamSize &&
                          selectedTeamMembers.length >= parseInt(teamSize);
                        const alreadySelected = selectedTeamMembers.includes(u.id);

                        return (
                          <button
                            key={u.id}
                            onClick={() => {
                              if (isDisabled) {
                                alert("입력한 팀 인원수를 초과할 수 없습니다.");
                                return;
                              }
                              if (!alreadySelected) {
                                setSelectedTeamMembers([
                                  ...selectedTeamMembers,
                                  u.id,
                                ]);
                              }
                            }}
                            disabled={isDisabled || alreadySelected}
                            className={`block w-full text-left px-2 py-1 rounded ${
                              isDisabled || alreadySelected
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : "hover:bg-sky-100"
                            }`}
                          >
                            {u.username} ({u.id})
                          </button>
                        );
                      })}
                  </div>

                  {selectedTeamMembers.map((uid) => (
                    <div key={uid} className="bg-gray-50 border rounded p-2">
                      <div className="flex justify-between items-center mb-2">
                        <span>{uid}</span>
                        <button
                          onClick={() => {
                            setSelectedTeamMembers(
                              selectedTeamMembers.filter((x) => x !== uid)
                            );
                            const copy = { ...memberRoles };
                            delete copy[uid];
                            setMemberRoles(copy);
                          }}
                          className="text-red-500"
                        >
                          ×
                        </button>
                      </div>
                      {renderRoleButtons(uid)}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4">
                <Button onClick={closeModal} className="border border-gray-300">
                  취소
                </Button>
                <Button onClick={handleTeamSubmit} className="bg-sky-500 text-white">
                  신청
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
