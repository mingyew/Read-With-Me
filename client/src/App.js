import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Story from "./pages/Story";
import Stories from "./pages/Stories";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Stories />}></Route>
        <Route path="/story/:id" element={<Story />}></Route>
      </Routes>
    </Router>
  );
}
export default App;
