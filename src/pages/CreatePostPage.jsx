//CreatePostPage
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import api from "../api";
import { useUser } from "../contexts/UserContext";

export default function CreatePostPage() {
  const tabs = ["자유게시판", "홍보게시판", "후기모음", "질문게시판"];
  const [tab, setTab] = useState(tabs[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false); // ✅ 익명 여부
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("로그인이 필요한 기능입니다.");
      navigate("/community");
      return;
    }

    if (!user) {
      const savedUser = localStorage.getItem("user");
      if (!savedUser) {
        alert("로그인이 필요한 기능입니다.");
        navigate("/community");
      }
    }
  }, [user, navigate]);

  const convertTabToCategory = (tab) => {
    switch (tab) {
      case "자유게시판": return "free";
      case "홍보게시판": return "promo";
      case "후기모음": return "review";
      case "질문게시판": return "question";
      default: return "free";
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }
    if (title.length > 200) {
      alert("제목은 200자 이내로 입력해주세요.");
      return;
    }

    try {
      await api.post("/api/community/posts/", {
        title,
        content,
        category: convertTabToCategory(tab),
        is_anonymous: isAnonymous, // ✅ 포함
      });
      alert("글 작성이 완료되었습니다!");
      navigate("/community");
    } catch (error) {
      console.error("게시글 작성 오류:", error.response?.data || error.message);
      alert("글 작성 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-white">
      <h1 className="text-3xl font-bold mb-8">글 작성</h1>

      <div className="flex flex-col gap-6">
        {/* 카테고리 선택 */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full border border-gray-300 rounded-lg p-3 text-left text-lg flex items-center justify-between shadow hover:bg-gray-50"
          >
            <span className="flex items-center gap-2">🗂️ {tab}</span>
            <ChevronDownIcon className="w-5 h-5 text-gray-500" />
          </button>

          {dropdownOpen && (
            <ul className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg">
              {tabs.map(option => (
                <li
                  key={option}
                  onClick={() => {
                    setTab(option);
                    setDropdownOpen(false);
                  }}
                  className={`px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 ${
                    option === tab ? "text-sky-600 font-semibold" : ""
                  }`}
                >
                  🗂️ {option}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ✅ 익명/공개 선택 */}
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="anonymity"
              checked={!isAnonymous}
              onChange={() => setIsAnonymous(false)}
            />
            공개 작성
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="anonymity"
              checked={isAnonymous}
              onChange={() => setIsAnonymous(true)}
            />
            익명 작성
          </label>
        </div>

        {/* 제목 입력 */}
        <input
          type="text"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-3 rounded text-lg"
        />

        {/* 내용 입력 */}
        <textarea
          placeholder="내용을 입력하세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border p-3 rounded h-60 text-lg"
        />

        <button
          onClick={handleSubmit}
          className="bg-sky-500 hover:bg-sky-600 text-white text-lg py-3 rounded"
        >
          작성 완료
        </button>
      </div>
    </div>
  );
}
