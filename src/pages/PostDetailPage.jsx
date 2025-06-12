import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import api from "../api";            // 인증 포함된 axios 인스턴스
import publicApi from "../api_public"; // 인증 없이 조회만 할 때 사용
import { Link } from "react-router-dom"

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");
  const [commentList, setCommentList] = useState([]);
  const [likesCount, setLikesCount] = useState(0);
  const [liked, setLiked] = useState(false); // 내가 이미 좋아요했는지 여부
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPostAndLikeStatus = async () => {
      try {
        // 1. 게시글 및 기존 좋아요 개수, 댓글 가져오기
        const resPost = await publicApi.get(`/api/community/posts/${id}/`);
        setPost(resPost.data);
        setCommentList(resPost.data.comments || []);
        setLikesCount(resPost.data.likes_count || 0);

        // 2. 현재 사용자가 이 게시글을 좋아요했는지 확인
        //    API: GET /api/community/likes/?post=<id>&user=<user.id>
        //    만약 필터링이 없다면, 모든 좋아요를 가져온 뒤 클라이언트에서 검사해도 됩니다.
        //    여기서는 간단히 GET으로 좋아요 전체를 불러오고, 클라이언트에서 user.id와 post.id가 일치하는 항목이 있는지 확인합니다.
        if (user) {
          const resLikes = await api.get(`/api/community/likes/`);
          // resLikes.data가 [{ id, post: <postId>, user: <userId>, ... }, ...]
          const existing = resLikes.data.find(
            (like) => like.post === resPost.data.id && like.user === user.id
          );
          if (existing) {
            setLiked(true);
          }
        }
      } catch (err) {
        console.error("게시글 조회 오류:", err);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndLikeStatus();
  }, [id, user]);

  const formatDate = (date) =>
    new Date(date).toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

  // 댓글 작성
  const handleAddComment = async () => {
    if (comment.trim() === "") return;

    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("로그인 후 댓글을 작성할 수 있습니다.");
      return;
    }

    try {
      const res = await api.post(
        "/api/community/comments/",
        {
          post: post.id,
          content: comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCommentList((prev) => [...prev, res.data]);
      setComment("");
    } catch (err) {
      console.error("댓글 작성 오류:", err.response?.data || err.message);
      alert("댓글 작성에 실패했습니다.");
    }
  };

  // 좋아요 버튼 클릭
  const handleAddLike = async () => {
    if (!user) {
      alert("로그인 후 좋아요를 누를 수 있습니다.");
      return;
    }
    if (liked) return; // 이미 눌렀으면 무시

    try {
      // POST /api/community/likes/ { post: post.id }
      const res = await api.post(
        "/api/community/likes/",
        { post: post.id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      // 성공하면 liked를 true로, 카운트 +1
      setLiked(true);
      setLikesCount((prev) => prev + 1);
    } catch (err) {
      console.error("좋아요 오류:", err.response?.data || err.message);
      // 400 에서 이미 좋아요를 누른 상태라면, setLiked(true)만 해도 됩니다.
      if (err.response?.status === 400) {
        setLiked(true);
      } else {
        alert("좋아요에 실패했습니다.");
      }
    }
  };

  if (loading) {
    return <p className="p-6 text-center">로딩 중...</p>;
  }

  if (!post) {
    return (
      <div className="p-6 min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">게시글을 찾을 수 없습니다.</h2>
        <button
          onClick={() => navigate("/community")}
          className="bg-sky-400 text-white py-2 px-4 rounded"
        >
          커뮤니티로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white">
      <aside className="w-60 border-r border-gray-200 p-6 hidden md:block">
        <h2 className="text-xl font-bold mb-4">카테고리</h2>
 
<ul className="space-y-3 text-gray-700">
  {["자유게시판", "홍보게시판", "후기모음", "질문게시판"].map((cat) => (
    <li key={cat}>
      {cat === post.category ? (
        <span className="text-sky-600 font-semibold">{cat}</span>
      ) : (
        <Link
          to={`/community?category=${cat}`}
          className="hover:text-sky-600 transition"
        >
          {cat}
        </Link>
      )}
    </li>
  ))}
</ul>
      </aside>

      <main className="flex-1 p-6 max-w-3xl mx-auto">
        <button
          onClick={() => navigate("/community")}
          className="text-sky-600 text-sm mb-4 hover:underline"
        >
          ← 목록으로
        </button>

        <p className="text-gray-500 mb-2">게시판: {post.category}</p>

        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-3">
            <img
              src={post.author?.avatar || "/default.png"}
              alt="프로필"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="text-sm font-medium text-gray-800">
                {post.author?.name || "익명"}
              </p>
              <p className="text-xs text-gray-500">{formatDate(post.created_at)}</p>
            </div>
          </div>
          <button className="text-sm text-red-500 border px-3 py-1 rounded hover:bg-red-50">
            신고하기
          </button>
        </div>

        <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
        <p className="text-lg text-gray-800 whitespace-pre-line mb-8">
          {post.content}
        </p>

        {/* 좋아요 버튼과 카운트 */}
        <div className="flex items-center gap-3 mb-10">
          <button
            onClick={handleAddLike}
            disabled={liked} // 이미 좋아요한 경우 비활성화
            className={`text-2xl transition ${
              liked ? "text-red-300 cursor-not-allowed" : "text-red-500 hover:scale-110"
            }`}
          >
            ♥
          </button>
          <span className="text-gray-700">{likesCount}</span>
        </div>

        {/* 댓글 입력 */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">댓글</h2>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="댓글을 입력하세요"
            className="w-full border p-3 rounded h-24"
          />
          <button
            onClick={handleAddComment}
            className="mt-2 bg-sky-500 text-white py-2 px-4 rounded hover:bg-sky-600"
          >
            댓글 달기
          </button>
        </div>

        {/* 댓글 목록 */}
        <ul className="space-y-4">
          {commentList.map((c) => (
            <li key={c.id} className="border-b pb-2">
              <div className="flex items-center gap-2 mb-1">
                <img
                  src={c.author?.avatar || "/default.png"}
                  alt="댓글 작성자"
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm font-medium">{c.author?.name || "익명"}</span>
                <span className="text-xs text-gray-500 ml-2">
                  {formatDate(c.created_at)}
                </span>
              </div>
              <p className="text-gray-800">{c.content}</p>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}