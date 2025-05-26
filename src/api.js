// src/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://172.30.1.24:8000/api', // 백엔드 주소 맞게!
});

export default API;
