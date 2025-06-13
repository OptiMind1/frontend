import React, { useState } from "react";
import api from "../api";
import "./Profile.css";

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
    <div className="profile-container" style={{ maxWidth: "500px", margin: "50px auto" }}>
      <h2 className="profile-title" style={{ textAlign: "center", marginBottom: "2rem" }}>사용자 검색</h2>

      <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "2rem" }}>
        <input
          type="text"
          placeholder="닉네임 입력"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          style={{
            width: "150px",
            padding: "0.5rem 0.75rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "1rem"
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            width: "60px",               // ✅ 버튼 가로 길이 고정
            padding: "0.4rem 0",
            backgroundColor: "#005BAC",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "0.9rem"
          }}
        >
          검색
        </button>
      </div>

      {userInfo && (
        <div className="profile-card"
          style={{
            background: "#f9f9f9",
            borderRadius: "12px",
            padding: "1.5rem",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            textAlign: "center"
          }}
        >
          <img
            src={userInfo.profile_image || process.env.PUBLIC_URL + "/default-profile.png"}
            alt="프로필"
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              objectFit: "cover",
              marginBottom: "1rem"
            }}
          />
          <p><strong>닉네임:</strong> {userInfo.nickname}</p>
          <p><strong>대학교:</strong> {userInfo.university}</p>
          <p><strong>학적:</strong> {userInfo.degree_type}</p>
          <p><strong>학년:</strong> {userInfo.academic_year}</p>
          <p><strong>언어:</strong> {userInfo.languages?.length ? userInfo.languages.join(", ") : "없음"}</p>
          <p><strong>관심분야:</strong> {userInfo.interests?.length ? userInfo.interests.join(", ") : "없음"}</p>
        </div>
      )}
    </div>
  );
}

export default SearchUser;
