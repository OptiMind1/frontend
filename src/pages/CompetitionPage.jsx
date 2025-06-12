// src/components/CompetitionPage.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import publicApi from "../api_public";

export default function CompetitionPage() {
  const [filter, setFilter] = useState("전체");
  const [categoryFilter, setCategoryFilter] = useState("전체");
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedMainCategory, setSelectedMainCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [competitions, setCompetitions] = useState([]);
  const navigate = useNavigate();

  // --- 1) 백엔드에서 공모전 목록 불러오기 ---
  useEffect(() => {
    publicApi
      .get("/api/competition/")
      .then((res) => {
        console.log("✅ 공모전 데이터:", res.data);
        setCompetitions(res.data);
      })
      .catch((err) => console.error("공모전 불러오기 실패", err));
  }, []);

  // --- 2) 필터링 로직 ---
  const filteredData = competitions.filter((item) => {
    // “전체”는 모두 통과
    // “공모전”은 category가 “대외활동”이 아닌 것들만
    // “대외활동”은 category가 “대외활동”인 것만
    const typeMatch =
      filter === "전체" ||
      (filter === "공모전" && item.category !== "대외활동") ||
      (filter === "대외활동" && item.category === "대외활동");

    // 카테고리(서브카테고리) 필터가 “전체”가 아니면 subcategory가 일치하는 것만
    const categoryMatch =
      categoryFilter === "전체" || item.subcategory === categoryFilter;

    return typeMatch && categoryMatch;
  });

  // 큰 카테고리별 세부 카테고리 목록
  const categoryDetails = {
    "아이디어/창업/네이밍": ["창업", "아이디어", "슬로건", "네이밍", "마케팅"],
    "사진/영상": ["사진", "영상"],
    "디자인/그림/웹툰": ["포스터", "로고", "상품", "캐릭터", "그림", "웹툰"],
    "문학/학술/공학": ["논문", "수기", "시", "시나리오", "공학", "과학"],
    "예체능/e스포츠": ["음악", "댄스", "e스포츠"],
    "기타": [],
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-sky-700 mb-6">
        공모전 & 대외활동
      </h1>

      {/* --- 필터 버튼 --- */}
      <div className="flex gap-4 border-b mb-6">
        {["전체", "공모전", "대외활동"].map((item) => (
          <button
            key={item}
            onClick={() => {
              setFilter(item);
              setCategoryFilter("전체");
            }}
            className={`pb-2 px-4 text-lg font-medium ${
              filter === item
                ? "border-b-2 border-sky-600 text-sky-600"
                : "text-gray-500 hover:text-sky-600"
            }`}
          >
            {item}
          </button>
        ))}
        <button
          onClick={() => setShowCategoryModal(true)}
          className="ml-auto px-4 py-2 text-sm font-semibold border-2 border-sky-600 text-white bg-sky-600 rounded hover:bg-sky-700 transition"
        >
          분야 선택
        </button>
      </div>

      {/* --- 공모전 카드 그리드 --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData.length > 0 ? (
          filteredData.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/competition/${item.id}`)}
              className="bg-white p-5 rounded-xl shadow border border-gray-200 hover:border-sky-500 hover:shadow-lg transition cursor-pointer"
            >
              {/* ===== 여기에 poster_image 추가 ===== */}
              {item.poster_image ? (
                <img
                  src={`http://127.0.0.1:8000${item.poster_image}`}
                  alt={item.title}
                  className="w-full h-40 object-cover rounded mb-3"
                />
              ) : (
                <div className="w-full h-40 bg-gray-100 rounded mb-3 flex items-center justify-center">
                  <span className="text-gray-400">이미지 없음</span>
                </div>
              )}

              {/* 카드 텍스트 (타입 / 제목 / 카테고리) */}
              <div className="text-xs text-gray-400 mb-1">
                {item.category === "대외활동" ? "대외활동" : "공모전"}
              </div>
              <h3 className="text-lg font-semibold mb-2 text-sky-700">
                {item.title}
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                {item.category} / {item.subcategory}
              </p>
            </div>
          ))
        ) : (
          <p className="col-span-3 text-center text-gray-500">
            조건에 맞는 공모전/대외활동이 없습니다.
          </p>
        )}
      </div>

      {/* --- 카테고리 모달 --- */}
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
              <h2 className="text-lg font-bold text-sky-700">분야 선택</h2>

              {/* 큰 분야 버튼들 */}
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(categoryDetails).map((main) => (
                  <button
                    key={main}
                    onClick={() => {
                      setSelectedMainCategory(main);
                      setSelectedSubCategory("");
                    }}
                    className={`border px-3 py-2 rounded ${
                      selectedMainCategory === main
                        ? "border-sky-500 bg-sky-50 text-sky-600"
                        : "border-gray-300"
                    }`}
                  >
                    {main}
                  </button>
                ))}
              </div>

              {/* 세부 분야 선택 */}
              {selectedMainCategory &&
                categoryDetails[selectedMainCategory].length > 0 && (
                  <div className="pt-4 border-t space-y-2">
                    <h3 className="text-sm font-semibold text-sky-700">
                      세부 분야 선택
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {categoryDetails[selectedMainCategory].map((sub) => (
                        <button
                          key={sub}
                          onClick={() => {
                            setCategoryFilter(sub);
                            setShowCategoryModal(false);
                          }}
                          className="border border-sky-300 text-sky-600 rounded px-3 py-2 hover:bg-sky-50"
                        >
                          {sub}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              {/* 기타 선택 (서브 카테고리 없는 경우) */}
              {selectedMainCategory &&
                categoryDetails[selectedMainCategory].length === 0 && (
                  <div className="pt-4 border-t">
                    <button
                      onClick={() => {
                        setCategoryFilter(selectedMainCategory);
                        setShowCategoryModal(false);
                      }}
                      className="w-full border border-sky-300 text-sky-600 rounded px-3 py-2 hover:bg-sky-50"
                    >
                      {selectedMainCategory} 선택
                    </button>
                  </div>
                )}

              <button
                onClick={() => setShowCategoryModal(false)}
                className="w-full mt-4 border border-gray-300 text-gray-600 py-2 rounded hover:bg-gray-100"
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
