// src/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000", 
  // 또는 "http://192.168.1.103:8000" 처럼 내부 IP 를 사용하셔도 됩니다.
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;
