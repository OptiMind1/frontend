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

  // 공모전 목록을 담을 state
  const [competitions, setCompetitions] = useState([]);
  const navigate = useNavigate();

  // (선택) <b>…</b> 태그 안의 짧은 제목을 크롤링해서 저장하는 state
  // → 크롤링으로 “정확한 짧은 제목”을 가져오겠다면, 아래 useEffect를 활성화하세요.
  const [detailTitles, setDetailTitles] = useState({});

  // ─────────────────────────────────────────────────────────────────────────────
  // 1) 마운트 시점에 /api/competition/ 로부터 전체 공모전 데이터를 불러옴
  useEffect(() => {
    publicApi
      .get("/api/competition/")
      .then((res) => {
        setCompetitions(res.data || []);
      })
      .catch((err) => console.error("공모전 불러오기 실패", err));
  }, []);

  // ─────────────────────────────────────────────────────────────────────────────
  // 2) (선택) competitions가 변경될 때마다 크롤링 API를 호출해서 <b>…</b> 태그 안 제목을 detailTitles에 저장
  //    → “item.title” 대신 크롤링한 정확한 짧은 제목을 보여 주고 싶다면 이 useEffect를 활성화하세요.
  /*
  useEffect(() => {
    if (competitions.length === 0) return;
    const newTitles = {};

    const requests = competitions.map((item) => {
      // 이미 detailTitles에 값이 있으면 건너뛴다
      if (detailTitles[item.id]) {
        newTitles[item.id] = detailTitles[item.id];
        return Promise.resolve();
      }

      const encodedUrl = encodeURIComponent(item.link);
      return publicApi
        .get(`/api/competition/crawl/detail/?url=${encodedUrl}`)
        .then((res) => {
          const html = res.data.description || "";
          // DOMParser 또는 임시 <div>에 innerHTML 세팅 후 <b> 태그만 뽑아오기
          const temp = document.createElement("div");
          temp.innerHTML = html;
          const bTag = temp.querySelector("b");
          if (bTag && bTag.textContent) {
            newTitles[item.id] = bTag.textContent.trim();
          } else {
            // 크롤링 실패했거나 <b>가 없으면 fallback으로 item.title 잘라 쓰기
            newTitles[item.id] = item.title.split(" – ")[0];
          }
        })
        .catch(() => {
          // 요청 실패 시 fallback
          newTitles[item.id] = item.title.split(" – ")[0];
        });
    });

    Promise.all(requests).then(() => {
      setDetailTitles((prev) => ({ ...prev, ...newTitles }));
    });
  }, [competitions]);
  */

  // ─────────────────────────────────────────────────────────────────────────────
  // 3) 필터링 로직 (상단 “전체/공모전/대외활동” + “카테고리”)
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
    "기타": [],
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-sky-700 mb-6">
        공모전 &amp; 대외활동
      </h1>

      {/* 필터 탭 바 */}
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

      {/* 카드 그리드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData.length > 0 ? (
          filteredData.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/competition/${item.id}`)}
              className="bg-white p-5 rounded-xl shadow border border-gray-200 hover:border-sky-500 hover:shadow-lg transition cursor-pointer"
            >
              <div className="text-xs text-gray-400 mb-1">{item.type}</div>

              {/* 제목 */}
              <h3 className="text-lg font-semibold mb-2 truncate">
                {(() => {
                  // detailTitles[item.id]가 있으면 그것을, 없으면 item.title
                  const rawTitle = detailTitles[item.id]
                    ? detailTitles[item.id]
                    : item.title;

                  // 1) “ – ” 있으면 분리
                  if (rawTitle.includes(" – ")) {
                    return rawTitle.split(" – ")[0];
                  }
                  // 2) “ - ”(영문 대시) 있을 경우
                  if (rawTitle.includes(" - ")) {
                    return rawTitle.split(" - ")[0];
                  }
                  // 3) 구분자 없으면 최대 30자까지만 보이기
                  const MAX_LEN = 30;
                  if (rawTitle.length > MAX_LEN) {
                    return rawTitle.slice(0, MAX_LEN) + "…";
                  }
                  // 4) 그 외는 원본 그대로
                  return rawTitle;
                })()}
              </h3>

              <p className="text-gray-500 text-sm mb-4">{item.category}</p>
            </div>
          ))
        ) : (
          <p className="col-span-3 text-center text-gray-500">
            조건에 맞는 공모전/대외활동이 없습니다.
          </p>
        )}
      </div>

      {/* 분야 선택 모달 */}
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
