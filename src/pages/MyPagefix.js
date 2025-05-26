import React, { useState } from "react";
import axios from "axios";
import "./Profile.css";
import api from "../api";


function MyPagefix() {
  const [formData, setFormData] = useState({
    gender: "",
    university: "",
    academic_year: "",
    degree_type: "",
    nickname: "",
    languages: "",
    interests: "",
    profile_image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profileImage") {
      setFormData((prev) => ({ ...prev, profileImage: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nicknameRegex = /^[a-zA-Z0-9가-힣]+$/;
    if (!nicknameRegex.test(formData.nickname)) {
      return alert("닉네임에는 공백이나 특수문자를 사용할 수 없습니다.");
    }

    try {
      const token = localStorage.getItem("token");
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      await api.post("/api/profiles/create/", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("추가 정보 저장 완료");
    } catch (err) {
      alert("저장 실패: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="profile-container">
      <h2 className="profile-title">추가 정보 입력</h2>
      <form className="profile-form" onSubmit={handleSubmit}>
        <label>성별</label>
        <input type="text" name="gender" placeholder="성별" onChange={handleChange} />

        <label>학교</label>
        <input type="text" name="university" placeholder="학교" onChange={handleChange} />

        <label>학년</label>
        <input type="text" name="academic_year" placeholder="학년" onChange={handleChange} />

        <label>대학생 or 대학원생</label>
        <input type="text" name="degree_type" placeholder="대학생 or 대학원생" onChange={handleChange} />

        <label>닉네임</label>
        <input type="text" name="nickname" placeholder="닉네임" onChange={handleChange} required />

        <label>사용 언어</label>
        <input type="text" name="languages" placeholder="사용 언어" onChange={handleChange} />

        <label>관심 분야</label>
        <input type="text" name="interests" placeholder="관심 분야" onChange={handleChange} />

        <label>프로필 이미지</label>
        <input type="file" name="profile_image" onChange={handleChange} />

        <button type="submit">저장</button>
      </form>
    </div>
  );
}

export default MyPagefix;
