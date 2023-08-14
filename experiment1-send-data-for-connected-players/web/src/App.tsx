import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import Navigation from "./components/Navigation";
import Header from "./components/Header";
import Layout from "./components/Layout";
import { PocketProvider } from "./services/PocketProvider";
import { SignUp } from "./pages/SignUpPage";
import { SignIn } from "./pages/SigninPage";
import { RequireAuth } from "./components/RequireAuth";
import { Protected } from "./pages/ProtectedPage";

const App = () => {
  return (
    <PocketProvider>
      <Router>
        <Layout>
          <Header />
          <Navigation />
          <Route index element={<SignUp />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/protected" element={<RequireAuth />}>
            <Route path="/" element={<Protected />} />
          </Route>
        </Layout>
      </Router>
    </PocketProvider>
  );
};

export default App;







// <Routes>
//   <Route path="/" element={<HomePage />} />
//   <Route path="/about" element={<AboutPage />} />
// </Routes> 