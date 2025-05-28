import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";
import { useNavigate } from "react-router-dom";
import api from "../api";


function MyPage() {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        console.log("보내는 토큰:", token);  // ✅ 추가
      
        const res = await api.get("/api/profiles/me/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("응답 데이터:", res.data);
        setUserInfo(res.data);
      } catch (err) {

        const status = err.response?.status;

        if (status === 400) {
          alert("프로필이 아직 등록되지 않았습니다.");
          navigate("/mypagefix");  // ✅ 프로필 등록 페이지로 이동
        } else {
        console.error("회원 정보 요청 실패 응답:", err.response?.data);
        alert("회원 정보 불러오기 실패");
        }
      }
    };

    fetchData();
  }, [navigate]);

  if (!userInfo) return <div className="profile-container">로딩 중...</div>;

  return (
    <div className="profile-container">
      <h2 className="profile-title">내 정보</h2>

      {/* 프로필 이미지 */}
      <div className="profile-image-wrapper">
        {userInfo.imageUrl ? (
          <img src={userInfo.imageUrl} alt="프로필 이미지" className="profile-image" />
        ) : (
          <div className="profile-image-placeholder">이미지 없음</div>
        )}
      </div>

      <ul className="profile-info-list">
        <li>닉네임: {userInfo.profile.nickname}</li>
        <li>학적/학년: {userInfo.profile.degree_type} / {userInfo.profile.academic_year}</li>
        <li>대학교(캠퍼스): {userInfo.profile.university}</li>
        <li>사용 가능 언어: {userInfo.profile.languages?.join(", ")}</li>
        <li>관심 분야: {userInfo.profile.interests?.join(", ")}</li>
      </ul>

      <button onClick={() => navigate("/mypagefix")}>정보 수정</button>
    </div>
  );
}

export default MyPage;
