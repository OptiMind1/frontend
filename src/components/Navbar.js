import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "홈" },
    { path: "/intro", label: "소개" },
    { path: "/competition", label: "공모전 & 대외활동" },
    { path: "/community", label: "커뮤니티" },
    { path: "/mypage", label: "마이페이지" },
  ];

  return (
    <nav className="bg-white shadow py-4 mb-6">
      <div className="container mx-auto flex justify-center space-x-6">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`text-lg font-semibold transition-colors ${
              location.pathname === item.path
                ? 'text-sky-500' // 현재 페이지일 때 하늘색
                : 'text-gray-700 hover:text-sky-500' // hover할 때 하늘색
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
