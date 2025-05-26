import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import axios from "axios";
import { useUser } from "../contexts/UserContext"; // ✅ 수정된 부분

export default function CreatePostPage() {
  const tabs = ["자유게시판", "홍보게시판", "후기모음", "질문게시판"];
  const [tab, setTab] = useState(tabs[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();
  const { user } = useUser(); // ✅ 수정된 부분

  const handleSubmit = async () => {
    if (!title || !content) return;

    try {
      await axios.post("/api/posts", {
        title,
        content,
        tab,
        authorId: user.id,
      });
      navigate("/community");
    } catch (error) {
      console.error("게시글 작성 오류:", error);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-white">
      <h1 className="text-3xl font-bold mb-8">글 작성</h1>

      <div className="flex flex-col gap-6">
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

        <input
          type="text"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-3 rounded text-lg"
        />

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
