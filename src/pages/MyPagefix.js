import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import api from "../api";


function MyPagefix() {
  const [formData, setFormData] = useState({
    gender: "",
    university: "",
    degree_type: "",
    academic_year: "",
    nickname: "",
    languages: [],
    interests: [],
    profile_image: null,
  });

  const [isNicknameUnique, setIsNicknameUnique] = useState(null); // null: 검사 전, true/false
  const [checkingNickname, setCheckingNickname] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "nickname") {
      setIsNicknameUnique(null); // 닉네임 바뀌면 상태 초기화
    }
  };

  const handleMultiSelectChange = (e, field) => {
    const selected = Array.from(e.target.selectedOptions).map((opt) => opt.value);
    setFormData((prev) => ({ ...prev, [field]: selected }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      profile_image: e.target.files[0],
    }));
  };

  const checkNickname = async () => {
    const nicknameRegex = /^[a-zA-Z0-9가-힣]+$/;
    if (!nicknameRegex.test(formData.nickname)) {
      alert("닉네임을 입력해주세요.");
      return;
    }

    try {
      setCheckingNickname(true);
      const res = await api.get("/api/profiles/check_nickname/", {
        params: { nickname: formData.nickname },
      });

      if (res.data.is_duplicate) {
        alert("이미 사용 중인 닉네임입니다.");
        setIsNicknameUnique(false);
      } else {
        alert("사용 가능한 닉네임입니다.");
        setIsNicknameUnique(true);
      }
    } catch (err) {
      alert("닉네임 확인 실패: " + (err.response?.data?.message || err.message));
    } finally {
      setCheckingNickname(false);
    }
  };  

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nicknameRegex = /^[a-zA-Z0-9가-힣]+$/;
    if (!nicknameRegex.test(formData.nickname)) {
      return alert("닉네임에는 공백이나 특수문자를 사용할 수 없습니다.");
    }

    if (isNicknameUnique !== true) {
      return alert("닉네임 중복 확인을 해주세요.");
    }

    try {
      // const token = localStorage.getItem("token");
      const token = localStorage.getItem("access_token");

      const data = new FormData();
      data.append("gender", formData.gender);
      data.append("university", formData.university);
      data.append("academic_year", formData.academic_year);
      data.append("degree_type", formData.degree_type);
      data.append("nickname", formData.nickname);

      // ✅ 반드시 배열로 감싸고 JSON.stringify 해줘야 함
      data.append("languages", JSON.stringify(formData.languages));
      data.append("interests", JSON.stringify(formData.interests));

      if (formData.profile_image) {
        data.append("profile_image", formData.profile_image);
      }

      await api.post("/api/profiles/create/", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("추가 정보 저장 완료");
      navigate("/mypage");
    } catch (err) {
      alert("저장 실패: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="profile-container">
      <h2 className="profile-title">추가 정보 입력</h2>
      <form className="profile-form" onSubmit={handleSubmit}>
        <label htmlFor="university">대학교</label>
        <input
          type="text"
          name="university"
          placeholder="대학교명 입력"
          value={formData.university}
          onChange={handleChange}
          required
        />

        <label htmlFor="degree_type">학적 구분</label>
        <select name="degree_type" value={formData.degree_type} onChange={handleChange} required>
          <option value="">선택</option>
          <option value="undergraduate">대학생</option>
          <option value="graduate">대학원생</option>
        </select>

        <label htmlFor="academic_year">학년</label>
        <input
          type="text"
          name="academic_year"
          placeholder="학년"
          value={formData.academic_year}
          onChange={handleChange}
          required
        />

        <label htmlFor="gender">성별</label>
        <select name="gender" value={formData.gender} onChange={handleChange} required>
          <option value="">선택</option>
          <option value="male">남성</option>
          <option value="female">여성</option>
          <option value="other">기타</option>
        </select>

        <label htmlFor="languages">사용 언어 (여러 개 선택 시, ctrl을 누르고 선택해주세요.)</label>
        <select
          name="languages"
          multiple
          value={formData.languages}
          onChange={(e) => handleMultiSelectChange(e, "languages")}
          required
        >
          <option value="Korean">Korean</option>
          <option value="English">English</option>
          <option value="Vietnamese">Vietnamese</option>
          <option value="Hindi">Hindi</option>
          <option value="Chinese">Chinese</option>
          <option value="Japanese">Japanese</option>
          <option value="French">French</option>
          <option value="German">German</option>
          <option value="Spanish">Spanish</option>
          <option value="Arabic">Arabic</option>
        </select>
        <ul className="selected-list">
          {formData.languages.map((lang, idx) => (
            <li key={idx}>{lang}</li>
          ))}
        </ul>
        <label htmlFor="nickname">닉네임</label>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <input
            type="text"
            name="nickname"
            placeholder="닉네임"
            value={formData.nickname}
            onChange={handleChange}
            required
            style={{ flex: 1 }}
          />
          <button
            type="button"
            onClick={checkNickname}
            disabled={checkingNickname}
            style={{ whiteSpace: "nowrap" }}
          >
            {checkingNickname ? "확인 중..." : "중복 확인"}
          </button>
        </div>
        {isNicknameUnique === true && <div style={{ color: "green" }}>사용 가능한 닉네임입니다.</div>}
        {isNicknameUnique === false && <div style={{ color: "red" }}>이미 사용 중인 닉네임입니다.</div>}

        <label htmlFor="interests">관심 분야(ctrl을 누르고 선택해주세요.)</label>
        <select
          name="interests"
          multiple
          value={formData.interests}
          onChange={(e) => handleMultiSelectChange(e, "interests")}
          required
        >
          <option value="창업">창업</option>
          <option value="아이디어">아이디어</option>
          <option value="슬로건">슬로건</option>
          <option value="네이밍">네이밍</option>
          <option value="마케팅">마케팅</option>
          <option value="사진">사진</option>
          <option value="영상">영상</option>
          <option value="포스터">포스터</option>
          <option value="로고">로고</option>
          <option value="상품">상품</option>
          <option value="캐릭터">캐릭터</option>
          <option value="그림">그림</option>
          <option value="웹툰">웹툰</option>
          <option value="광고">광고</option>
          <option value="도시건축">도시건축</option>
          <option value="논문">논문</option>
          <option value="수기">수기</option>
          <option value="시">시</option>
          <option value="시나리오">시나리오</option>
          <option value="공학">공학</option>
          <option value="과학">과학</option>
          <option value="음악">음악</option>
          <option value="댄스">댄스</option>
          <option value="e스포츠">e스포츠</option>
          <option value="기타">기타</option>
        </select>
        <ul className="selected-list">
          {formData.interests.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>

        <label htmlFor="profile_image">프로필 사진</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />

        <button type="submit">저장</button>
      </form>
    </div>
  );
}

export default MyPagefix;