import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import publicApi from "../api_public";

const NAVY = "#00274d";
const NAVY_LIGHT = "#336699";
const NAVY_HOVER = "#004080";
const BG_LIGHT = "#f9fbfd";

export default function CompetitionPage() {
  const [filter, setFilter] = useState("전체");
  const [categoryFilter, setCategoryFilter] = useState("전체");
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedMainCategory, setSelectedMainCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
 
  const [competitions, setCompetitions] = useState([]); // ✅ 공모전 목록 상태
  const navigate = useNavigate();

  // ✅ API 호출: 백엔드에서 공모전 목록 가져오기
  useEffect(() => {
    publicApi.get("/api/competition/")
      .then((res) => setCompetitions(res.data))
      .catch((err) => console.error("공모전 불러오기 실패", err));
  }, []);

  // 카테고리 필터링
    const filteredData = competitions.filter((item) => {
    const typeMatch = filter === "전체" || item.type === filter;
    const categoryMatch = categoryFilter === "전체" || item.category.includes(categoryFilter);
    return typeMatch && categoryMatch;
  });

  // const data = [
  //   { id: 1, type: "공모전", title: "창의력 공모전 2025", category: "아이디어/창업/네이밍", color: "text-sky-600" },
  //   { id: 2, type: "대외활동", title: "글로벌 리더십 캠프", category: "기타", color: "text-sky-700" },
  //   { id: 3, type: "공모전", title: "환경 보호 공모전", category: "문학/학술/공학", color: "text-sky-600" },
  //   { id: 4, type: "대외활동", title: "청년 스타트업 프로그램", category: "아이디어/창업/네이밍", color: "text-sky-700" },
  //   { id: 5, type: "공모전", title: "AI 해커톤 대회", category: "문학/학술/공학", color: "text-sky-600" },
  //   { id: 6, type: "대외활동", title: "국제 교환학생 프로그램", category: "문학/학술/공학", color: "text-sky-700" },
  // ];

  const categoryDetails = {
    "아이디어/창업/네이밍": ["창업", "아이디어", "슬로건", "네이밍", "마케팅"],
    "사진/영상": ["사진", "영상"],
    "디자인/그림/웹툰": ["포스터", "로고", "상품", "캐릭터", "그림", "웹툰"],
    "문학/학술/공학": ["논문", "수기", "시", "시나리오", "공학", "과학"],
    "예체능/e스포츠": ["음악", "댄스", "e스포츠"],
    "기타": []
  };

  return (
    <div style={{ backgroundColor: BG_LIGHT }} className="p-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-6" style={{ color: NAVY }}>공모전 & 대외활동</h1>

      <div className="flex gap-4 border-b mb-6">
        {["전체", "공모전", "대외활동"].map((item) => (
          <button
            key={item}
            onClick={() => {
              setFilter(item);
              setCategoryFilter("전체");
            }}
            className={`pb-2 px-4 text-lg font-medium transition ${
              filter === item ? "border-b-2" : "hover:text-[color:#004080] text-gray-500"
            }`}
            style={{
              borderColor: filter === item ? NAVY_HOVER : "transparent",
              color: filter === item ? NAVY_HOVER : undefined,
            }}
          >
            {item}
          </button>
        ))}
        <button
          onClick={() => setShowCategoryModal(true)}
          className="ml-auto px-4 py-2 text-sm font-semibold border-2 rounded transition"
          style={{
            borderColor: NAVY,
            backgroundColor: NAVY,
            color: "white",
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = NAVY_HOVER}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = NAVY}
        >
          분야 선택
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData.length > 0 ? (
          filteredData.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/competition/${item.id}`)}
              className="bg-white p-5 rounded-xl shadow border border-gray-200 hover:shadow-lg transition cursor-pointer"
              style={{ borderColor: "#ccd6e0" }}
            >
              <div className="text-xs text-gray-400 mb-1">{item.type}</div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: NAVY_LIGHT }}>{item.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{item.category}</p>
            </div>
          ))
        ) : (
          <p className="col-span-3 text-center text-gray-500">조건에 맞는 공모전/대외활동이 없습니다.</p>
        )}
      </div>

      <AnimatePresence>
        {showCategoryModal && (
          <div
            className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
            onClick={() => setShowCategoryModal(false)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="bg-white p-6 rounded-xl w-[400px] max-h-[90vh] overflow-y-auto shadow-xl space-y-4"
            >
              <h2 className="text-lg font-bold" style={{ color: NAVY }}>분야 선택</h2>

              {/* 큰 분야 버튼들 */}
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(categoryDetails).map((main) => (
                  <button
                    key={main}
                    onClick={() => {
                      setSelectedMainCategory(main);
                      setSelectedSubCategory("");
                    }}
                    className="border px-3 py-2 rounded transition"
                    style={{
                      borderColor:
                        selectedMainCategory === main ? NAVY_HOVER : "#ccc",
                      backgroundColor:
                        selectedMainCategory === main ? "#e6f0fa" : "white",
                      color:
                        selectedMainCategory === main ? NAVY_HOVER : "black"
                    }}
                  >
                    {main}
                  </button>
                ))}
              </div>

              {/* 세부 분야 선택 */}
              {selectedMainCategory && categoryDetails[selectedMainCategory].length > 0 && (
                <div className="pt-4 border-t space-y-2">
                  <h3 className="text-sm font-semibold" style={{ color: NAVY }}>세부 분야 선택</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {categoryDetails[selectedMainCategory].map((sub) => (
                      <button
                        key={sub}
                        onClick={() => {
                          setCategoryFilter(sub);
                          setShowCategoryModal(false);
                        }}
                        className="border rounded px-3 py-2 transition"
                        style={{
                          borderColor: NAVY_LIGHT,
                          color: NAVY_HOVER,
                          backgroundColor: "white"
                        }}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 기타 선택 */}
              {selectedMainCategory && categoryDetails[selectedMainCategory].length === 0 && (
                <div className="pt-4 border-t">
                  <button
                    onClick={() => {
                      setCategoryFilter(selectedMainCategory);
                      setShowCategoryModal(false);
                    }}
                    className="w-full border rounded px-3 py-2"
                    style={{
                      borderColor: NAVY_LIGHT,
                      color: NAVY_HOVER,
                      backgroundColor: "white"
                    }}
                  >
                    {selectedMainCategory} 선택
                  </button>
                </div>
              )}

              <button
                onClick={() => setShowCategoryModal(false)}
                className="w-full mt-4 border py-2 rounded transition"
                style={{
                  borderColor: "#ccc",
                  color: "#555",
                  backgroundColor: "#f5f5f5"
                }}
              >
                닫기
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
