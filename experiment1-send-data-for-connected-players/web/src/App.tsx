import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Header from "./components/Header";
import Layout from "./components/Layout";
import { SignUp } from "./pages/SignUpPage";
import { SignIn } from "./pages/SigninPage";
import { RequireAuth } from "./components/RequireAuth";
import { Protected } from "./pages/ProtectedPage";

const App = () => {
  return (
    <Router>
      <Layout>
        <Header />
        <Navigation />
        <Routes>
          <Route index element={<SignUp />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/protected" element={<RequireAuth />}>
            <Route path="/protected/" element={<Protected />} />
          </Route>
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;

// <Routes>
//   <Route path="/" element={<HomePage />} />
//   <Route path="/about" element={<AboutPage />} />
// </Routes>
