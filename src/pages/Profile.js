import React, { useState } from "react";
import axios from "axios";
import "./Profile.css";
import { useNavigate } from "react-router-dom";
import api from "../api";

const countries = [
  { name: "Korea", code: "+82", flag: "🇰🇷" },
  { name: "USA", code: "+1", flag: "🇺🇸" },
  { name: "Vietnam", code: "+84", flag: "🇻🇳" },
  { name: "India", code: "+91", flag: "🇮🇳" },
  { name: "China", code: "+86", flag: "🇨🇳" },
  { name: "Japan", code: "+81", flag: "🇯🇵" },
  { name: "France", code: "+33", flag: "🇫🇷" },
  { name: "Germany", code: "+49", flag: "🇩🇪" },
  { name: "Mexico", code: "+52", flag: "🇲🇽" },
  { name: "Brazil", code: "+55", flag: "🇧🇷" },
  { name: "UK", code: "+44", flag: "🇬🇧" },
  { name: "Canada", code: "+1", flag: "🇨🇦" },
  { name: "Indonesia", code: "+62", flag: "🇮🇩" },
  { name: "Russia", code: "+7", flag: "🇷🇺" },
  { name: "Spain", code: "+34", flag: "🇪🇸" },
];

const Profile=() => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    birthdate: "",
    nationality: "",
    phoneCode: "+82",
    phoneMiddle: "",
    phoneLast: "",
    email: "",
    user_id: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 전화번호 병합
     const submitData = {
      ...formData,
      phone: `${formData.phoneCode}-${formData.phoneMiddle}-${formData.phoneLast}`
    };

    // 불필요한 필드 제거
    delete submitData.phoneCode;
    delete submitData.phoneMiddle;
    delete submitData.phoneLast;

    try {
      await api.post("/api/users/signup/", submitData);
    } catch (error) {
      return alert("회원가입 실패: " + (error.response?.data?.message || error.message));
    }

    alert("회원가입 완료");
    navigate("/login");
  };

  return (
    <div className="profile-container">
      <h2 className="profile-title">회원가입</h2>
      <form className="profile-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="이름 (본명)"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="birthdate"
          value={formData.birthdate}
          onChange={handleChange}
          required
        />
        <select
          name="nationality"
          value={formData.nationality}
          onChange={handleChange}
          required
        >
          <option value="">국적 선택</option>
          {countries.map((c) => (
            <option key={c.code} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>

        {/* 전화번호 입력 */}
        <div className="phone-input-group">
          <select
            name="phoneCode"
            value={formData.phoneCode}
            onChange={handleChange}
            required
          >
            {countries.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.name} ({c.code})
              </option>
            ))}
          </select>
          <input
            type="text"
            name="phoneMiddle"
            maxLength="4"
            placeholder="1234"
            value={formData.phoneMiddle}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="phoneLast"
            maxLength="4"
            placeholder="5678"
            value={formData.phoneLast}
            onChange={handleChange}
            required
          />
        </div>

        <input
          type="email"
          name="email"
          placeholder="이메일"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="user_id"
          placeholder="아이디"
          value={formData.user_id}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="비밀번호"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit">회원가입</button>
      </form>
    </div>
  );
};

export default Profile;

      