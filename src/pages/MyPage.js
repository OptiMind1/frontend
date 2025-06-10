import React, { useEffect, useState } from "react";
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
        const res = await api.get("/api/profiles/me/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("프로필 응답:", res.data.profile);
        setUserInfo(res.data);
      } catch (err) {
        const status = err.response?.status;
        if (status === 400) {
          navigate("/mypagefix");
        } else {
          alert("회원 정보 불러오기 실패");
        }
      }
    };
    fetchData();
  }, [navigate]);

  if (!userInfo) return <div className="profile-container">로딩 중...</div>;

  // 백엔드 속성 확인 후 아래 필드명 사용
  const imgUrl = userInfo.profile.profile_image;

  return (
    <div className="profile-container">
      <h2 className="profile-title">내 정보</h2>
      <div className="profile-image-wrapper">
        {imgUrl ? (
          <img src={imgUrl} alt="프로필 이미지" className="profile_image" />
        ) : (
          <div className="profile-image-placeholder">이미지 없음</div>
        )}
      </div>
      <ul className="profile-info-list">
        <li>아이디: {userInfo.user_id}</li>
        <li>이름: {userInfo.name}</li>
        <li>생년월일: {userInfo.birth}</li>
        <li>전화번호: {userInfo.phone}</li>
        <li>이메일: {userInfo.email}</li>
        <li>국적: {userInfo.nationality}</li>
        <li>닉네임: {userInfo.profile.nickname}</li>
        <li>학적/학년: {userInfo.profile.degree_type} / {userInfo.profile.academic_year}</li>
        <li>대학교: {userInfo.profile.university}</li>
        <li>언어: {userInfo.profile.languages?.join(", ")}</li>
        <li>관심 분야: {userInfo.profile.interests?.join(", ")}</li>
      </ul>
      <button onClick={() => navigate("/mypageedit")}>정보 수정</button>
    </div>
  );
}

export default MyPage;
