import React, { useState } from "react";
import axios from "axios";
import "./Profile.css";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { useUser } from "../contexts/UserContext"; // ✅ 추가




function Login() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUser } = useUser(); // ✅ context의 setUser 사용


  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/api/users/login/", { user_id : id, password });
      const token = res.data.access;
      // localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("access_token", token);
      localStorage.setItem("refresh_token", res.data.refresh);

      try {
        // 🔍 프로필 있는지 확인
        const profileRes = await api.get("/api/profiles/me/", {
          headers: { Authorization: `Bearer ${token}` }
        });

        const userData = profileRes.data;

        localStorage.setItem("user", JSON.stringify(userData)); // ✅ localStorage 저장
        setUser(userData); // ✅ context 반영

        alert("로그인 성공");
        navigate("/mypage");
        
      } catch (profileErr) {
        alert("로그인 성공 - 추가 정보가 필요합니다.");
        // 🔍 프로필이 없으면 등록 페이지로
        navigate("/mypagefix");
      }

    } catch (err) {
      alert("로그인 실패: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="profile-container">
      <h2 className="profile-title">로그인</h2>
      <form className="profile-form" onSubmit={handleLogin}>
        <label>아이디</label>
        <input
          type="text"
          placeholder="아이디"
          value={id}
          onChange={(e) => setId(e.target.value)}
          required
        />

        <label>비밀번호</label>
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">로그인</button>
      </form>
    </div>
  );
}

export default Login;