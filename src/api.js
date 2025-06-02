import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/',
  headers: {
      'Content-Type': 'application/json',
  },
});

// ✅ 요청 시마다 토큰을 Authorization 헤더에 자동 추가
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  console.log("🔥 보낼 Authorization 헤더:", token); // ← 이거 콘솔에 출력되게 해보자

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});


export default API;
