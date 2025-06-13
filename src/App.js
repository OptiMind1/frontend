//App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MyPage from "./pages/MyPage";
import Profile from "./pages/Profile";
import Intro from "./pages/Intro";
import CompetitionPage from "./pages/CompetitionPage";
import CommunityPage from "./pages/CommunityPage";
import CompetitionDetail from "./pages/CompetitionDetail";
import CreatePostPage from "./pages/CreatePostPage";
import PostDetailPage from "./pages/PostDetailPage"; 


import { UserProvider } from "./contexts/UserContext";

import MyPagefix from "./pages/MyPagefix";
import SearchUser from "./pages/SearchUser";
import ChatRoom from './pages/ChatRoom';
function App() {
  return (
      <UserProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/mypagefix" element={<MyPagefix />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/intro" element={<Intro />} />
          <Route path="/competition" element={<CompetitionPage />} />
          <Route path="/competition/:id" element={<CompetitionDetail />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/create" element={<CreatePostPage />} />
          <Route path="/search" element={<SearchUser />} />
          <Route path="/post/:id" element={<PostDetailPage />} />
          <Route path="/chatroom" element={<ChatRoom />} />
        </Routes>
      </UserProvider>
  );
}

export default App;