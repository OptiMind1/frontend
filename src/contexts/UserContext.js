import { createContext, useContext, useState, useEffect } from "react";

// 1. Context 생성
const UserContext = createContext(null);

// 2. Provider 컴포넌트
export const UserProvider = ({ children }) => {
  // 로그인된 사용자 정보 (예시)
  //(user_id : 로그인 ID, name : 본명)
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));  // 새로고침해도 유지
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// 3. 커스텀 훅: 다른 컴포넌트에서 사용자 정보 쉽게 접근 가능
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
