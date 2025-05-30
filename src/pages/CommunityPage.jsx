import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import publicApi from "../api_public";


export default function CommunityPage() {
  const tabs = ["자유게시판", "홍보게시판", "후기모음", "질문게시판"];
  const [selectedTab, setSelectedTab] = useState("자유게시판");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const tabToCategory = {
    자유게시판: "free",
    홍보게시판: "promo",
    후기모음: "review",
    질문게시판: "question",
  };

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await publicApi.get(`/api/community/posts/?category=${tabToCategory[selectedTab]}`);
        setPosts(res.data);
      } catch (err) {
        console.error("게시글 불러오기 실패:", err);
        alert("게시글을 불러오는 데 실패했습니다.");
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [selectedTab]);

  // const filteredPosts = posts.filter(post => post.tab === selectedTab);

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

        {loading ? (
          <p className="text-gray-500">로딩 중...</p>
        ) : posts.length === 0 ? (
          <p className="text-gray-500">게시글이 없습니다.</p>
        ) : (
          <ul className="space-y-5">
            {posts.map((post) => (
              <li key={post.id} className="border-b pb-4 overflow-hidden">
                <Link to={`/post/${post.id}`}>
                  <h3 className="text-lg font-semibold hover:underline truncate">
                    {post.title}
                  </h3>
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
          <button className="fixed bottom-10 right-10 bg-sky-500 hover:bg-sky-600 text-white rounded-full w-14 h-14 text-3xl shadow-lg">+</button>
        </Link>
      </main>
    </div>
  );
}
