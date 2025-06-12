import React, { useState } from "react";
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

  const [emailCheck, setEmailCheck] = useState(null);
  const [usernameCheck, setUsernameCheck] = useState(null);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "email") setEmailCheck(null);
    if (name === "user_id") setUsernameCheck(null);
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

    if (emailCheck !== true || usernameCheck !== true) {
      alert("아이디와 이메일 중복 확인을 완료해주세요.");
      return;
    }
    console.log(formData);
    alert("회원가입 완료!");
    navigate("/login");
  };

  const checkEmail = () => {
    if (!formData.email.trim()) {
      alert("이메일을 입력하세요.");
      return;
    }
    console.log("Checking email:", formData.email);
    if (formData.email === "test@example.com") {
      alert("이미 사용 중인 이메일입니다.");
      setEmailCheck(false);
    } else {
      alert("사용 가능한 이메일입니다.");
      setEmailCheck(true);
    }
  };

  const checkUsername = () => {
    if (!formData.user_id.trim()) {
      alert("아이디를 입력하세요.");
      return;
    }
    console.log("Checking username:", formData.user_id);
    if (formData.user_id === "admin") {
      alert("이미 사용 중인 아이디입니다.");
      setUsernameCheck(false);
    } else {
      alert("사용 가능한 아이디입니다.");
      setUsernameCheck(true);
    }
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

         {/* 이메일 입력 + 중복 확인 */}
        <div className="check-row">
          <input
            type="email"
            name="email"
            placeholder="이메일"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <button type="button" onClick={checkEmail}>중복 확인</button>
        </div>
        {emailCheck === true && <div style={{ color: "green" }}>사용 가능한 이메일입니다.</div>}
        {emailCheck === false && <div style={{ color: "red" }}>이미 사용 중인 이메일입니다.</div>}

        
        {/* 아이디 입력 + 중복 확인 */}
        <div className="check-row">
          <input
            type="text"
            name="user_id"
            placeholder="아이디"
            value={formData.user_id}
            onChange={handleChange}
            required
          />
          <button type="button" onClick={checkUsername}>중복 확인</button>
        </div>
        {usernameCheck === true && <div style={{ color: "green" }}>사용 가능한 아이디입니다.</div>}
        {usernameCheck === false && <div style={{ color: "red" }}>이미 사용 중인 아이디입니다.</div>}

        
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

      