// api_public.js
import axios from "axios";

const publicApi = axios.create({
  baseURL: "http://127.0.0.1:8000",  // /api 포함 X
  headers: {
    "Content-Type": "application/json",
  },
});

export default publicApi;
