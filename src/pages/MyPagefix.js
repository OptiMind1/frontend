import React, { useState, useEffect } from "react";
import "./Profile.css";
import { useNavigate } from "react-router-dom";
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
  const [preview, setPreview] = useState("");
  const [originalNickname, setOriginalNickname] = useState("");
  const [isNicknameUnique, setIsNicknameUnique] = useState(null);
  const [checkingNickname, setCheckingNickname] = useState(false);
  const [profileId, setProfileId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await api.get("/api/profiles/me/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const p = res.data.profile;
        setProfileId(p.id);
        setFormData({
          gender: p.gender,
          university: p.university,
          degree_type: p.degree_type,
          academic_year: p.academic_year,
          nickname: p.nickname,
          languages: p.languages || [],
          interests: p.interests || [],
          profile_image: null,
        });
        setOriginalNickname(p.nickname);
        if (p.profile_image || p.profile_image_url) {
          setPreview(p.profile_image || p.profile_image_url);
        }
      } catch {
        // 신규 등록 모드
      }
    };
    loadProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === "nickname") setIsNicknameUnique(null);
  };

  const handleMultiSelectChange = (e, field) => {
    const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
    setFormData(prev => ({ ...prev, [field]: selected }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({ ...prev, profile_image: file }));
    setPreview(URL.createObjectURL(file));
  };

  const checkNickname = async () => {
    if (!formData.nickname) return alert("닉네임을 입력해주세요.");
    if (formData.nickname === originalNickname) {
      setIsNicknameUnique(true);
      return alert("현재 닉네임을 사용 중입니다.");
    }
    try {
      setCheckingNickname(true);
      const res = await api.get("/api/profiles/check_nickname/", { params: { nickname: formData.nickname } });
      if (res.data.is_duplicate) {
        alert("이미 사용 중인 닉네임입니다.");
        setIsNicknameUnique(false);
      } else {
        alert("사용 가능한 닉네임입니다.");
        setIsNicknameUnique(true);
      }
    } catch {
      alert("닉네임 확인 실패");
    } finally { setCheckingNickname(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.nickname !== originalNickname && isNicknameUnique !== true) {
      return alert("닉네임 중복 확인을 해주세요.");
    }

    const token = localStorage.getItem("access_token");
    const data = new FormData();
    ["gender","university","degree_type","academic_year","nickname"].forEach(key => {
      data.append(key, formData[key]);
    });
    data.append("languages", JSON.stringify(formData.languages));
    data.append("interests", JSON.stringify(formData.interests));
    if (formData.profile_image) data.append("profile_image", formData.profile_image);

    try {
      // 인증 헤더 포함
      const config = { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } };
      // update via POST to create endpoint to avoid duplicate errors
      await api.post("/api/profiles/create/", data, config);
      alert(profileId ? "정보가 수정되었습니다." : "추가 정보 저장 완료");
      navigate("/mypage");
    } catch (err) {
      alert("저장 실패: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="profile-container">
      <h2 className="profile-title">추가 정보 입력</h2>
      <form className="profile-form" onSubmit={handleSubmit} encType="multipart/form-data">
        <label>대학교</label>
        <input name="university" value={formData.university} onChange={handleChange} required />
        <label>학적 구분</label>
        <select name="degree_type" value={formData.degree_type} onChange={handleChange} required>
          <option value="">선택</option>
          <option value="undergraduate">대학생</option>
          <option value="graduate">대학원생</option>
        </select>
        <label>학년</label>
        <input name="academic_year" value={formData.academic_year} onChange={handleChange} required />

        <label>성별</label>
        <select name="gender" value={formData.gender} onChange={handleChange} required disabled={!!originalNickname}>
          <option value="">선택</option>
          <option value="male">남성</option>
          <option value="female">여성</option>
          <option value="other">기타</option>
        </select>

        <label>사용 언어(여러 개 선택 시, ctrl을 누르고 선택해주세요.)</label>
        <select multiple name="languages" value={formData.languages} onChange={e => handleMultiSelectChange(e, "languages")}>
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

        <label>닉네임</label>
        <div style={{ display: "flex" }}>
          <input name="nickname" value={formData.nickname} onChange={handleChange} required />
          <button type="button" onClick={checkNickname} disabled={checkingNickname}>중복 확인</button>
        </div>

        <label>관심 분야(ctrl을 누르고 선택해주세요.)</label>
        <select multiple name="interests" value={formData.interests} onChange={e => handleMultiSelectChange(e, "interests")}>
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

        <label>프로필 사진</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {preview && <img src={preview} alt="미리보기" className="profile-image" />}

        <button type="submit">저장</button>
      </form>
    </div>
  );
}

export default MyPagefix;
