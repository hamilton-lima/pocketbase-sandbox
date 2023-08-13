import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import Navigation from "./components/Navigation";

const App = () => {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route exact path="/" component={HomePage} />
        <Route path="/about" component={AboutPage} />
      </Routes>
    </Router>
  );
};

export default App;
