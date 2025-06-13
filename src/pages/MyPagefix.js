import React, { useState } from "react";
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

  const [isNicknameUnique, setIsNicknameUnique] = useState(null);
  const [checkingNickname, setCheckingNickname] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "nickname") {
      setIsNicknameUnique(null);
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
      alert("닉네임은 공백이나 특수문자를 포함할 수 없습니다.");
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
      const token = localStorage.getItem("access_token");

      // ✅ FormData 구성
      const data = new FormData();
      data.append("gender", formData.gender);
      data.append("university", formData.university);
      data.append("academic_year", formData.academic_year);
      data.append("degree_type", formData.degree_type);
      data.append("nickname", formData.nickname);
      data.append("languages", JSON.stringify(formData.languages));
data.append("interests", JSON.stringify(formData.interests));
      if (formData.profile_image) {
        data.append("profile_image", formData.profile_image);
      }

      // ✅ 프로필 존재 여부 확인
      try {
        await api.get("/api/profiles/me/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // 있으면 PATCH
        await api.patch("/api/profiles/me/", data, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        alert("프로필 수정 완료");
      } catch (checkErr) {
        if (checkErr.response?.status === 404) {
          // 없으면 POST
          await api.post("/api/profiles/create/", data, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          });
          alert("프로필 생성 완료");
        } else {
          throw checkErr;
        }
      }

      navigate("/mypage");
    } catch (err) {
      console.error("❌ 저장 실패:", err.response?.data || err);
      alert("저장 실패: " + JSON.stringify(err.response?.data || err.message));
    }
  };

  return (
    <div className="profile-container">
      <h2 className="profile-title">추가 정보 입력</h2>
      <form className="profile-form" onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem", textAlign: "center" }}>
          <img
            src={
              formData.profile_image
                ? URL.createObjectURL(formData.profile_image)
                : process.env.PUBLIC_URL + "/default-profile.png"
            }
            alt="프로필 미리보기"
            style={{ width: "120px", height: "120px", objectFit: "cover", borderRadius: "50%" }}
          />
        </div>

        <label>대학교</label>
        <input
          type="text"
          name="university"
          value={formData.university}
          onChange={handleChange}
          required
        />

        <label>학적 구분</label>
        <select name="degree_type" value={formData.degree_type} onChange={handleChange} required>
          <option value="">선택</option>
          <option value="undergraduate">대학생</option>
          <option value="graduate">대학원생</option>
        </select>

        <label>학년</label>
        <input
          type="text"
          name="academic_year"
          value={formData.academic_year}
          onChange={handleChange}
          required
        />

        <label>성별</label>
        <select name="gender" value={formData.gender} onChange={handleChange} required>
          <option value="">선택</option>
          <option value="male">남성</option>
          <option value="female">여성</option>
          <option value="other">기타</option>
        </select>

        <label>사용 언어 (ctrl 누르고 다중 선택)</label>
        <select
          name="languages"
          multiple
          value={formData.languages}
          onChange={(e) => handleMultiSelectChange(e, "languages")}
          required
        >
          {["Korean", "English", "Vietnamese", "Hindi", "Chinese", "Japanese", "French", "German", "Spanish", "Arabic"].map((lang) => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
        <ul className="selected-list">
          {formData.languages.map((lang, idx) => <li key={idx}>{lang}</li>)}
        </ul>

        <label>닉네임</label>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <input
            type="text"
            name="nickname"
            value={formData.nickname}
            onChange={handleChange}
            required
            style={{ flex: 1 }}
          />
          <button
            type="button"
            onClick={checkNickname}
            disabled={checkingNickname}
          >
            {checkingNickname ? "확인 중..." : "중복 확인"}
          </button>
        </div>
        {isNicknameUnique === true && <div style={{ color: "green" }}>사용 가능한 닉네임입니다.</div>}
        {isNicknameUnique === false && <div style={{ color: "red" }}>이미 사용 중인 닉네임입니다.</div>}

        <label>관심 분야 (ctrl 누르고 다중 선택)</label>
        <select
          name="interests"
          multiple
          value={formData.interests}
          onChange={(e) => handleMultiSelectChange(e, "interests")}
          required
        >
          {[
            "창업", "아이디어", "슬로건", "네이밍", "마케팅",
            "사진", "영상", "포스터", "로고", "상품", "캐릭터", "그림",
            "웹툰", "광고", "도시건축", "논문", "수기", "시", "시나리오",
            "공학", "과학", "음악", "댄스", "e스포츠", "기타"
          ].map((interest) => (
            <option key={interest} value={interest}>{interest}</option>
          ))}
        </select>
        <ul className="selected-list">
          {formData.interests.map((item, idx) => <li key={idx}>{item}</li>)}
        </ul>

        <label>프로필 사진</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />

        <button type="submit">저장</button>
      </form>
    </div>
  );
}

export default MyPagefix;
