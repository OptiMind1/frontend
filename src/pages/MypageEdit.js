import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import api from "../api";


function MyPageEdit() {
  const [formData, setFormData] = useState(null);
  const [originalNickname, setOriginalNickname] = useState("");
  const [isNicknameUnique, setIsNicknameUnique] = useState(true);
  const [checkingNickname, setCheckingNickname] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await api.get("/api/profiles/me/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // API returns user + nested profile
        const data = res.data;
        setFormData({
          username: data.username,
          gender: data.profile.gender,
          name: data.name,
          birth: data.birth,
          phone: data.phone,
          email: data.email,
          nationality: data.nationality,
          profile: {
            nickname: data.profile.nickname,
            degree_type: data.profile.degree_type,
            academic_year: data.profile.academic_year,
            university: data.profile.university,
            languages: data.profile.languages || [],
            interests: data.profile.interests || [],
          },
        });
        setOriginalNickname(data.profile.nickname);
      } catch (err) {
        alert("정보 불러오기 실패");
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    if (name.startsWith("profile.")) {
      const key = name.split(".")[1];
      setFormData(prev => ({
        ...prev,
        profile: { ...prev.profile, [key]: value }
      }));
      if (key === "nickname") {
        setIsNicknameUnique(value === originalNickname);
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleNicknameCheck = async () => {
    if (!formData.profile.nickname) return alert("닉네임을 입력해주세요.");
    if (formData.profile.nickname === originalNickname) {
      setIsNicknameUnique(true);
      return alert("현재 닉네임을 사용 중입니다.");
    }
    try {
      setCheckingNickname(true);
      const res = await api.get("/api/profiles/check_nickname/", {
        params: { nickname: formData.profile.nickname }
      });
      if (res.data.is_duplicate) {
        setIsNicknameUnique(false);
        alert("이미 사용 중인 닉네임입니다.");
      } else {
        setIsNicknameUnique(true);
        alert("사용 가능한 닉네임입니다.");
      }
    } catch (err) {
      console.error(err);
      alert("닉네임 확인 중 오류 발생");
    } finally {
      setCheckingNickname(false);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!isNicknameUnique) {
      return alert("닉네임 중복 확인을 해주세요.");
    }
    try {
      const token = localStorage.getItem("access_token");
      // Prepare payload matching API
      const payload = {
        name: formData.name,
        birth: formData.birth,
        phone: formData.phone,
        email: formData.email,
        nationality: formData.nationality,
        profile: {
          nickname: formData.profile.nickname,
          degree_type: formData.profile.degree_type,
          academic_year: formData.profile.academic_year,
          university: formData.profile.university,
          languages: formData.profile.languages,
          interests: formData.profile.interests,
        }
      };
      await api.get("/api/profiles/me/", payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("수정 완료!");
      navigate("/mypage");
    } catch (err) {
      console.error(err.response?.data || err);
      alert("수정 실패: " + (err.response?.data?.detail || err.message));
    }
  };

  if (!formData) return <div className="profile-container">로딩 중...</div>;

  return (
    <div className="profile-container">
      <h2 className="profile-title">내 정보 수정</h2>
      <form onSubmit={handleSubmit} className="profile-form">
        <label>아이디: {formData.user_id}</label><br />
        <label>성별: {formData.gender}</label><br />

        <label>이름:
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </label><br />

        <label>생년월일:
          <input type="date" name="birth" value={formData.birth} onChange={handleChange} required />
        </label><br />

        <label>전화번호:
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />
        </label><br />

        <label>이메일:
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </label><br />

        <label>국적:
          <input type="text" name="nationality" value={formData.nationality} onChange={handleChange} required />
        </label><br />

        <label>닉네임:
          <input type="text" name="profile.nickname" value={formData.profile.nickname} onChange={handleChange} required />
          <button type="button" onClick={handleNicknameCheck} disabled={checkingNickname}>
            {checkingNickname ? "확인 중..." : "중복 확인"}
          </button>
        </label>
        {!isNicknameUnique && <div style={{ color: 'red' }}>닉네임 중복입니다.</div>}
        <br />

        <label>학적 구분:
          <select name="profile.degree_type" value={formData.profile.degree_type} onChange={handleChange} required>
            <option value="undergraduate">학부</option>
            <option value="graduate">대학원</option>
          </select>
        </label><br />

        <label>학년:
          <input type="number" name="profile.academic_year" value={formData.profile.academic_year} onChange={handleChange} required />
        </label><br />

        <label>대학교:
          <input type="text" name="profile.university" value={formData.profile.university} onChange={handleChange} required />
        </label><br />

        <label>사용 가능 언어 (쉼표 구분):
          <input
            type="text"
            name="profile.languages"
            value={formData.profile.languages.join(", ")}
            onChange={e => {
              const langs = e.target.value.split(",").map(l => l.trim());
              setFormData(prev => ({ ...prev, profile: { ...prev.profile, languages: langs } }));
            }}
          />
        </label><br />

        <label>관심 분야 (쉼표 구분):
          <input
            type="text"
            name="profile.interests"
            value={formData.profile.interests.join(", ")}
            onChange={e => {
              const ints = e.target.value.split(",").map(i => i.trim());
              setFormData(prev => ({ ...prev, profile: { ...prev.profile, interests: ints } }));
            }}
          />
        </label><br />

        <button type="submit">저장</button>
      </form>
    </div>
  );
}

export default MyPageEdit;
