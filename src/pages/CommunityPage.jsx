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
  const [detailTitles, setDetailTitles] = useState({});

  useEffect(() => {
    publicApi
      .get("/api/competition/")
      .then((res) => {
        setCompetitions(res.data || []);
      })
      .catch((err) => console.error("공모전 불러오기 실패", err));
  }, []);

  const filteredData = competitions.filter((item) => {
    const matchType = filter === "전체" || item.type === filter;
    const matchCategory =
      categoryFilter === "전체" || item.category.includes(categoryFilter);
    return matchType && matchCategory;
  });

  const categoryDetails = {
    "아이디어/창업/네이밍": ["창업", "아이디어", "슬로건", "네이밍", "마케팅"],
    "사진/영상": ["사진", "영상"],
    "디자인/그림/웹툰": ["포스터", "로고", "상품", "캐릭터", "그림", "웹툰"],
    "문학/학술/공학": ["논문", "수기", "시", "시나리오", "공학", "과학"],
    "예체능/e스포츠": ["음악", "댄스", "e스포츠"],
    기타: [],
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-sky-700 mb-6">
        공모전 &amp; 대외활동
      </h1>

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData.length > 0 ? (
          filteredData.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/competition/${item.id}`)}
              className="bg-white p-5 rounded-xl shadow border border-gray-200 hover:border-sky-500 hover:shadow-lg transition cursor-pointer"
            >
              {/* 이미지 표시 */}
              {item.poster_image ? (
                <img
                  src={
                    item.poster_image.startsWith("/")
                      ? `https://www.all-con.co.kr${item.poster_image}`
                      : item.poster_image
                  }
                  alt={item.title}
                  className="w-full h-40 object-cover rounded mb-3"
                />
              ) : (
                <div className="w-full h-40 bg-gray-100 text-gray-400 flex items-center justify-center mb-3">
                  이미지 없음
                </div>
              )}

              <div className="text-xs text-gray-400 mb-1">공모전</div>
              <h3 className="text-lg font-semibold mb-2 truncate">
                {(() => {
                  const rawTitle = detailTitles[item.id]
                    ? detailTitles[item.id]
                    : item.title;
                  if (rawTitle.includes(" – ")) return rawTitle.split(" – ")[0];
                  if (rawTitle.includes(" - ")) return rawTitle.split(" - ")[0];
                  const MAX_LEN = 30;
                  if (rawTitle.length > MAX_LEN)
                    return rawTitle.slice(0, MAX_LEN) + "…";
                  return rawTitle;
                })()}
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
