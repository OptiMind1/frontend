import { createContext, useContext, useState, useEffect } from "react";

// 1. Context 생성
export const UserContext = createContext(null);

// 2. Provider 컴포넌트
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // 새로고침 시 localStorage에 저장된 사용자 정보 유지
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // 로그인 함수
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // 로그아웃 함수
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  };

  return (
    <UserContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// 3. 커스텀 훅
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

