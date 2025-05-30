import React, { useState } from "react";
import axios from "axios";
import "./Profile.css";
import api from "../api";


function SearchUser() {
  const [nickname, setNickname] = useState("");
  const [userInfo, setUserInfo] = useState(null);

  const handleSearch = async () => {
    if (!nickname) return alert("닉네임을 입력하세요.");

    try {
      const res = await api.get(`/api/profiles/search/?nickname=${nickname}`);
      setUserInfo(res.data);
    } catch (err) {
      alert("사용자를 찾을 수 없습니다.");
      setUserInfo(null);
    }
  };

  return (
    <div className="profile-container">
      <h2 className="profile-title">사용자 검색</h2>
      <div style={{ display: "flex", gap: "10px", marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="닉네임 입력"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        <button onClick={handleSearch}>검색</button>
      </div>

      {userInfo && (
        <div className="profile-card">
          <img
            src={userInfo.profile_image}
            alt="프로필"
            style={{ width: "100px", height: "100px", borderRadius: "50%" }}
          />
          <p><strong>닉네임:</strong> {userInfo.nickname}</p>
          <p><strong>대학교:</strong> {userInfo.university}</p>
          <p><strong>학적:</strong> {userInfo.degree_type}</p>
          <p><strong>학년:</strong> {userInfo.academic_year}</p>
          <p><strong>언어:</strong> {userInfo.languages?.join(", ")}</p>
          <p><strong>관심분야:</strong> {userInfo.interests?.join(", ")}</p>
        </div>
      )}
    </div>
  );
}

export default SearchUser;
