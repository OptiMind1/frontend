// src/api_public.js
import axios from "axios";

const publicApi = axios.create({
  baseURL: "http://localhost:8000",  // ✅ 이걸로 바꿔주세요
  headers: {
    "Content-Type": "application/json",
  },
});

export default publicApi;
