import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Storypage from "./pages/Storypage";
import Signup from "./pages/Signup";
import Stories from "./pages/Stories";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Stories />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/story/:id" element={<Storypage />}></Route>
      </Routes>
    </Router>
  );
}
export default App;
