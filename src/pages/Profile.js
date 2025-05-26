import React, { useState } from "react";
import API from "../api";
import "./Profile.css";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [formData, setFormData] = useState({
    name: "",
    birth: "",         // → birthdate로 변환 예정
    nationality: "",
    phone: "",
    email: "",
    id: "",            // → user_id로 변환 예정
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ 백엔드 요구 형식에 맞게 변환
    const payload = {
      user_id: formData.id,
      email: formData.email,
      password: formData.password,
      name: formData.name,
      birthdate: formData.birth,
      nationality: formData.nationality,
      phone: formData.phone,
    };

    try {
      await API.post("/signup/", payload);
      alert("회원가입 완료");
      navigate("/login");
    } catch (error) {
      console.error("🔥 전체 에러 객체:", error);
      console.error("🔎 응답 객체:", error.response);
      alert("회원가입 실패: " + (
        error.response?.data?.message ||
        JSON.stringify(error.response?.data) ||
        error.message
      ));
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
          name="birth"
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
          name="id"
          value={formData.id}
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
