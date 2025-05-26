import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";
import { useNavigate } from "react-router-dom";

function MyPage() {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/userinfo", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserInfo(res.data);
      } catch (err) {
        alert("회원 정보 불러오기 실패");
      }
    };
    fetchData();
  }, []);

  if (!userInfo) return <div className="profile-container">로딩 중...</div>;

  return (
    <div className="profile-container">
      <h2>내 정보</h2>
      <ul>
        <li>이름: {userInfo.name}</li>
        <li>생년월일: {userInfo.birth}</li>
        <li>국적: {userInfo.nationality}</li>
        <li>전화번호: {userInfo.phone}</li>
        <li>이메일: {userInfo.email}</li>
        <li>아이디: {userInfo.id}</li>
      </ul>
      <button onClick={() => navigate("/mypagefix")}>추가 정보 입력</button>
    </div>
  );
}

export default MyPage;






