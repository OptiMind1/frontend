// CompetitionDetail.jsx

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "../contexts/UserContext";
import publicApi from "../api_public";
import api from "../api"; 



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
  const navigate = useNavigate();       // useNavigate 훅을 추가
  const { user } = useUser();

  const [competition, setCompetition] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [detailInfo, setDetailInfo] = useState(null);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [applicantType, setApplicantType] = useState("");
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedTeamMembers, setSelectedTeamMembers] = useState([]);
  const [memberRoles, setMemberRoles] = useState({});
  const [teamSize, setTeamSize] = useState("");

  // 1) competition 상세 정보 불러오기
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

  // 2) competition.link가 있으면 크롤링해서 detailInfo 업데이트
  useEffect(() => {
    if (!competition || !competition.link) return;

    const fetchDetailInfo = async () => {
      try {
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

  //같이 할 팀원 검색
  useEffect(() => {
    const fetchUsers = async () => {
      if (search.trim() === "") {
        setUsers([]);
        return;
      }

      try {
        const token = localStorage.getItem("access_token");
        const res = await api.get(`/api/profiles/search_team/?nickname=${search}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(res.data);  // ✅ 다수 반환을 기대
      } catch (err) {
        setUsers([]);  // 검색 실패 시 목록 초기화
      }
    };

    fetchUsers();
  }, [search]);

  const closeModal = () => {
    setShowTeamModal(false);
    setApplicantType("");
    setSelectedTeamMembers([]);
    setSearch("");
    setMemberRoles({});
    setTeamSize("");
  };

  const handleTeamSubmit = async () => {
    const token = localStorage.getItem("access_token");

    if (!applicantType) return alert("지원 방식을 선택해주세요.");

    try {
      if (applicantType === "개인") {
        
        const payload = {
          role: Array.isArray(memberRoles[user.user_id]) && memberRoles[user.user_id].length > 0
            ? memberRoles[user.user_id]
            : ["없음"],
          in_team: false,
          desired_partner: "",
          competition_id: competition.id,
          competition: competition.id //AI 알고리즘으로 넘기는 용도
        };

        try {
          const res = await api.post("/api/matching/request/", payload, {
            headers: { Authorization: `Bearer ${token}` }  // ✅ 추가
          });
          console.log("✅ 서버 응답:", res.data);
          alert("✅ 신청 완료!");
        } catch (err) {
          console.error("❌ 서버 오류:", err.response?.status, err.response?.data);
          alert("❌ 팀매칭 신청 실패: " + (err.response?.data?.message || err.message));
        }
      } else {
        if (selectedTeamMembers.length === 0) return alert("팀원을 선택해주세요.");
        
        // const filteredTeamMembers = selectedTeamMembers.filter((uid) => uid !== user.user_id);

        const members = [
          {
            user_id: user.user_id,
            role: Array.isArray(memberRoles[user.user_id]) && memberRoles[user.user_id].length > 0
              ? memberRoles[user.user_id]
              : ["없음"]
          },
          // ...selectedTeamMembers.map((user_id) => ({
          //   user_id,
          //   role: Array.isArray(memberRoles[user_id]) && memberRoles[user_id].length > 0
          //     ? memberRoles[user_id]
          //     : ["없음"]
          ...selectedTeamMembers
            .filter((id) => id !== user.user_id) // 혹시 중복될 경우 대비
            .map((id) => ({
              user_id: id,
              role: Array.isArray(memberRoles[id]) && memberRoles[id].length > 0
                ? memberRoles[id]
                : ["없음"]
          }))
      ];

        const payload = {
          members,
          in_team: true,
          desired_partner: "",  // 추후에 팀장 지정 등 확장 가능
          role : ["dummy"], // 어차피 역할은 members에 들어가있음
          competition_id : competition.id,
          
          competition: competition.id //AI 알고리즘으로 넘기는 용도

        };

        await api.post("/api/matching/request/", payload, {
            headers: { Authorization: `Bearer ${token}` }  // ✅ 추가
          });
        
        alert("✅ 신청 완료!");
      } 

      closeModal();
    } catch (err) {
        console.error("❌ 팀매칭 신청 실패:", err.response?.status, err.response?.data);
        alert("팀매칭 신청 실패: " + (err.response?.data?.message || err.message));
      }
    };

  // const handleTeamSubmit = async () => {
  //   const token = localStorage.getItem("access_token");

  //   if (!applicantType) {
  //     alert("지원 방식을 선택해주세요.");
  //     return;
  //   }

  //   if (applicantType === "개인") {
  //     if (!memberRoles[user.id]) {
  //       alert("역할을 선택해주세요.");
  //       return;
  //     }
  //     const payload = {
  //       competitionId: competition.id,
  //       applicantType,
  //       members: [{ id: user.id, role: memberRoles[user.id] }],
  //     };
  //     await api.post("/api/matching/request/", payload);
  //     alert("✅ 신청 완료!");
  //     closeModal();
  //   } else {
  //     if (selectedTeamMembers.length === 0) {
  //       alert("팀원을 선택해주세요.");
  //       return;
  //     }
  //     const incomplete = selectedTeamMembers.some((id) => !memberRoles[id]);
  //     if (incomplete) {
  //       alert("모든 팀원의 역할을 선택해주세요.");
  //       return;
  //     }

  //     const members = selectedTeamMembers.map((id) => ({
  //       id,
  //       role: memberRoles[id],
  //     }));

  //     const payload = {
  //       competitionId: competition.id,
  //       applicantType,
  //       members,
  //     };

  //     await api.post("/api/matching/request/", payload);
  //     alert("✅ 신청 완료!");
  //     closeModal();
  //   }
  // };

  const renderRoleButtons = (user_id) => {
    const selectedRoles = memberRoles[user_id] || [];

    const toggleRole = (role) => {
      const updatedRoles = selectedRoles.includes(role)
        ? selectedRoles.filter((r) => r !== role)
        : [...selectedRoles, role];

      setMemberRoles({ ...memberRoles, [user_id]: updatedRoles });
    };

    return (
      <div className="grid grid-cols-2 gap-2">
        {roleOptions.map((role) => (
          <button
            key={role}
            type="button"
            onClick={() => toggleRole(role)}
            className={`border px-3 py-1 rounded text-sm ${
              selectedRoles.includes(role)
                ? "border-sky-500 bg-sky-100 text-sky-700 font-semibold"
                : "border-gray-300"
            }`}
          >
            {role}
          </button>
        ))}
      </div>
    );
  };

  if (isLoading) return <div>로딩 중...</div>;
  if (!competition) return <div>공모전 정보를 불러오지 못했습니다.</div>;

  return (
    <div className="p-8">
      {/* ────────────────────────────────────────────────────────────────────────────
          뒤로 가기 버튼을 추가했습니다.  
          navigate(-1)은 브라우저 히스토리에서 한 단계 뒤로 돌아가고,  
          만약 히스토리가 없으면 /competition(목록)으로 강제 이동합니다.
      ──────────────────────────────────────────────────────────────────────────── */}
      <Button
        onClick={() => {
          // 히스토리 스택에 이전 페이지가 있으면 뒤로 가고, 없으면 "/competition"으로 이동
          if (window.history.state && window.history.state.idx > 0) {
            navigate(-1);
          } else {
            navigate("/competition");
          }
        }}
        className="mb-4 bg-gray-200 text-gray-800 hover:bg-gray-300"
      >
        ← 뒤로 가기
      </Button>

      {/* ──────────────────────────────────────────────────────────────────────────── */}
      <h1 className="text-2xl font-bold mb-4">{competition.title}</h1>
      <button
        onClick={() => {
          if (!user) {
            alert("로그인 후 이용해주세요.");
            return;
          }
          setShowTeamModal(true);
        }}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-6"
      >
        팀매칭 신청
      </button>

      {detailInfo && (
        <div className="mt-8 space-y-6">
          {detailInfo.image_url && (
            <div>
              <h2 className="text-lg font-semibold mb-2">포스터</h2>
              <img
                src={detailInfo.image_url}
                alt="공모전 포스터"
                className="max-w-md rounded border"
              />
            </div>
          )}

          {detailInfo.description && (
            <div>
              <h2 className="text-lg font-semibold mb-2">상세 설명</h2>
              {/* description에 HTML 전체가 들어 있으므로 dangerouslySetInnerHTML 사용 */}
              <div
                className="prose prose-lg"
                dangerouslySetInnerHTML={{ __html: detailInfo.description }}
              />
            </div>
          )}
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────────────────
          팀매칭 모달
      ──────────────────────────────────────────────────────────────────────────── */}
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
                    {user.name} ({user.user_id})
                  </div>
                  <label className="block text-sm font-semibold mt-2 mb-1">역할 선택</label>
                  {renderRoleButtons(user.user_id)}
                </div>
              )}

              {applicantType === "팀" && (
                <div className="space-y-4">
                  {/* 로그인한 사용자 역할 선택 */}
                  <div>
                    <label className="block text-sm font-semibold mt-2 mb-1">내 역할 선택</label>
                    <div className="mb-2 p-2 border rounded bg-gray-50 text-sm text-gray-700">
                      {user.name} ({user.user_id})
                    </div>
                    {renderRoleButtons(user.user_id)}
                  </div>

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
                    placeholder="아이디 또는 닉네임 검색"
                    className="w-full border rounded px-2 py-1"
                  />

                  <div className="border rounded max-h-32 overflow-y-auto p-2 space-y-1">
                    {users.map((user) => {
                        const isDisabled = teamSize && selectedTeamMembers.length >= parseInt(teamSize);
                        const alreadySelected = selectedTeamMembers.includes(user.user_id);
                      // .filter((u) => u.name.includes(search) || u.user_id.includes(search))

                        return (
                          <button
                            key={user.user_id}
                            onClick={() => {
                              if (isDisabled) return alert("입력한 팀 인원수를 초과할 수 없습니다.");
                              if (!alreadySelected) setSelectedTeamMembers([...selectedTeamMembers, user.user_id]);
                            }}
                            disabled={isDisabled || alreadySelected}
                            className={`block w-full text-left px-2 py-1 rounded ${
                              isDisabled || alreadySelected ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "hover:bg-sky-100"
                            }`}
                          >
                            {user.name} ({user.user_id})
                          </button>
                        );
                      })}
                  </div>

                  {selectedTeamMembers.map((user_id) => (
                    <div key={user_id} className="bg-gray-50 border rounded p-2">
                      <div className="flex justify-between items-center mb-2">
                        <span>{user_id}</span>
                        <button
                          onClick={() => {
                            setSelectedTeamMembers(selectedTeamMembers.filter((uid) => uid !== user_id));
                            const copy = { ...memberRoles };
                            delete copy[user_id];
                            setMemberRoles(copy);
                          }}
                          className="text-red-500"
                        >×</button>
                      </div>
                      {renderRoleButtons(user_id)}
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