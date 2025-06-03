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

// 응답 에러 처리 (토큰 만료시 자동 갱신)
API.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem("refresh_token")
    ) {
      originalRequest._retry = true;

      try {
        const res = await axios.post("http://127.0.0.1:8000/api/users/token/refresh/", {
          refresh: localStorage.getItem("refresh_token"),
        });

        const newAccessToken = res.data.access;
        localStorage.setItem("access_token", newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axios(originalRequest);
      } catch (refreshErr) {
        console.error("🔴 토큰 갱신 실패 : ", refreshErr);
        alert("세션이 만료되었습니다. 다시 로그인 해주세요.");
        localStorage.clear();
        window.location.href = "/login"; // 로그인 페이지로 이동
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);


export default API;
