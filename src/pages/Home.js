import React from 'react';
import { useNavigate } from 'react-router-dom'; // 페이지 이동용
import BackGround from '../assets/images/home.jpg';
import { useUser } from "../contexts/UserContext"; //로그인 상태 가져오기


const Home = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUser(); // ✅ 로그인 정보
  const isLoggedIn = !!user;           // 로그인 여부 판단

  const handleStart = () => {
    if (isLoggedIn) {
      navigate('/intro');
    } else {
      alert('로그인이 필요합니다.');
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignup = () => {
    navigate('/profile');
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user"); // 혹시 저장한 경우
    setUser(null);
    alert("로그아웃 되었습니다.");
    navigate('/');
  };

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${BackGround})` }}
    >
      {/* 배경 어둡게 오버레이 */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* ✅ 우상단 로그아웃 버튼 (로그인 되어있을 때만) */}
      {isLoggedIn && (
        <div className="absolute top-4 right-4 z-50">
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            로그아웃
          </button>
        </div>
      )}

      {/* 글씨 부분 */}
      <div className="relative z-10 text-center text-white px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-md">
          OptiMind
        </h1>
        <p className="text-lg md:text-xl mb-10 drop-shadow">
          세계 각국의 유학생들과 국내 학생들이 팀을 이루어 함께 성장하는 공간
        </p>
        <div className="flex flex-col gap-4 items-center">
          <button
            onClick={handleStart}
            className="w-64 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-lg font-semibold transition"
          >
            시작하기
          </button>

          {/* 로그인 안 된 경우에만 로그인/회원가입 버튼 표시 */}
          {!isLoggedIn && (
            <>
              <button
                onClick={handleLogin}
                className="w-64 py-3 bg-white hover:bg-gray-100 text-blue-600 rounded-md text-lg font-semibold transition"
              >
            로그인
          </button>
          <button
            onClick={handleSignup}
            className="w-32 py-3 bg-green-600 hover:bg-green-700 text-white rounded-md text-lg font-semibold transition"
          >
            회원가입
          </button>
          </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;