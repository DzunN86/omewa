import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BlogView from '../views/Blogs';
import LoginView from '../views/Login';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path={"/"} element={<BlogView />} />
        <Route path={"/login"} element={<LoginView />} />
      </Routes>
    </Router>
  );
};

export { AppRoutes as Routes };
