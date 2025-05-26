import React, { useState } from "react";
import axios from "axios";
import "./Profile.css";
import { useNavigate } from "react-router-dom";
import api from "../api";


function Profile() {
  const [formData, setFormData] = useState({
    name: "",
    birthdate: "",
    nationality: "",
    phone: "",
    email: "",
    user_id: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/users/signup/", formData);
      alert("회원가입 완료");
      navigate("/login");
    } catch (error) {
      console.log("에러 응답:", error.response?.data);  // 🔍 추가
      alert("회원가입 실패: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="profile-container">
      <h2 className="profile-title">회원가입</h2>
      <form className="profile-form" onSubmit={handleSubmit}>
        <label>이름</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label>생년월일</label>
        <input
          type="date"
          name="birthdate"
          value={formData.birth}
          onChange={handleChange}
          required
        />

        <label>국적</label>
        <input
          type="text"
          name="nationality"
          value={formData.nationality}
          onChange={handleChange}
          required
        />

        <label>전화번호</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <label>이메일</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label>아이디</label>
        <input
          type="text"
          name="user_id"
          value={formData.user_id}
          onChange={handleChange}
          required
        />

        <label>비밀번호</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit">회원가입</button>
      </form>
    </div>
  );
}

export default Profile;
