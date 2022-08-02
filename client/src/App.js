import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import StoryPage from "./pages/StoryPage";
import Signup from "./pages/Signup";
import Stories from "./pages/Stories";
import Login from "./pages/Login";
import PrivateRoute from "./pages/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route exact path="/" element={<PrivateRoute />}>
            <Route exact path="/" element={<Dashboard />} />
          </Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/stories" element={<Stories />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/story/:id/:uid" element={<StoryPage />}></Route>
          <Route path="/forgot-password" element={<ForgotPassword />}></Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}
export default App;
