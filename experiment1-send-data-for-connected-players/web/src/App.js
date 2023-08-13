import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import Navigation from "./components/Navigation";
import Header from "./components/Header";

const App = () => {
  return (
    <Router>
      <Header />
      <Navigation />
      <Routes>
        <Route exact path="/" component={HomePage} />
        <Route path="/about" component={AboutPage} />
      </Routes>
    </Router>
  );
};

export default App;
