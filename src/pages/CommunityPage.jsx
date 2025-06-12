import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import publicApi from "../api_public";

export default function CommunityPage() {
  const tabs = ["자유게시판", "홍보게시판", "후기모음", "질문게시판"];
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const queryCategory = queryParams.get("category");
  const defaultTab = tabs.includes(queryCategory) ? queryCategory : "자유게시판";

  const [selectedTab, setSelectedTab] = useState(defaultTab);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const tabToCategory = {
    자유게시판: "free",
    홍보게시판: "promo",
    후기모음: "review",
    질문게시판: "question",
  };

  useEffect(() => {
    setSelectedTab(defaultTab); // URL 변경 시 반영
  }, [location.search]);

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

  return (
    <div className="flex min-h-screen bg-white text-blue-900">
      <aside className="w-60 border-r border-gray-200 p-6 bg-blue-50">
        <h2 className="text-xl font-bold mb-4">카테고리</h2>
        <ul className="space-y-2">
          {tabs.map((tab) => (
            <li key={tab}>
              <button
                onClick={() => {
                  navigate(`/community?category=${tab}`);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200
                  ${selectedTab === tab
                    ? "bg-blue-200 text-blue-900 font-semibold shadow-inner"
                    : "text-blue-800 hover:bg-blue-100"}`}
              >
                {tab}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <main className="flex-1 p-6 relative bg-white">
        <h1 className="text-2xl font-bold mb-6">{selectedTab}</h1>

        {loading ? (
          <p className="text-blue-700 bg-blue-50 rounded p-4 border border-blue-100 shadow-sm">로딩 중...</p>
        ) : posts.length === 0 ? (
          <p className="text-blue-700 bg-blue-50 rounded p-4 border border-blue-100 shadow-sm">게시글이 없습니다.</p>
        ) : (
          <ul className="space-y-5">
            {posts.map((post) => (
              <li key={post.id} className="border-b pb-4 overflow-hidden">
                <Link to={`/post/${post.id}`}>
                  <h3 className="text-lg font-semibold text-blue-900 hover:underline truncate">
                    {post.title}
                  </h3>
                  <p className="text-sm text-blue-700 mt-1">
                    {post.content?.slice(0, 60)}...
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {/* 글쓰기 버튼 */}
        <Link to="/create">
          <button className="fixed bottom-10 right-10 bg-blue-800 hover:bg-blue-700 text-white rounded-full w-14 h-14 text-3xl shadow-lg transition-all">
            +
          </button>
        </Link>
      </main>
    </div>
  );
}
