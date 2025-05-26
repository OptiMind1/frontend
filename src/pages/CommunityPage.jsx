import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function CommunityPage({ posts = [] }) {
  const tabs = ["자유게시판", "홍보게시판", "후기모음", "질문게시판"];
  const [selectedTab, setSelectedTab] = useState("자유게시판");

  const filteredPosts = posts.filter(post => post.tab === selectedTab);

  return (
    <div className="flex min-h-screen bg-white text-gray-800">
      <aside className="w-60 border-r border-gray-200 p-6">
        <h2 className="text-xl font-bold mb-4">카테고리</h2>
        <ul className="space-y-3">
          {tabs.map((tab) => (
            <li key={tab}>
              <button
                onClick={() => setSelectedTab(tab)}
                className={`text-left w-full px-2 py-1 rounded hover:bg-gray-100 ${
                  selectedTab === tab ? "text-sky-600 font-semibold" : "text-gray-700"
                }`}
              >
                {tab}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <main className="flex-1 p-6 relative">
        <h1 className="text-2xl font-bold mb-6">{selectedTab}</h1>

        {filteredPosts.length === 0 ? (
          <p className="text-gray-500">게시글이 없습니다.</p>
        ) : (
          <ul className="space-y-5">
            {filteredPosts.map((post) => (
              <li key={post.id} className="border-b pb-4">
                <Link to={`/post/${post.id}`}>
                  <h3 className="text-lg font-semibold hover:underline">{post.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {post.content?.slice(0, 60)}...
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {/* 글쓰기 원형 버튼 */}
        <Link to="/create">
          <button
            className="fixed bottom-10 right-10 bg-sky-500 hover:bg-sky-600 text-white rounded-full w-14 h-14 text-3xl shadow-lg"
            title="글 작성"
          >
            +
          </button>
        </Link>
      </main>
    </div>
  );
}
