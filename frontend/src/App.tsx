import { Routes, Route } from "react-router-dom";
import SignInSide from "./pages/signin/SignInSide";
import SignUp from "./pages/signup/SignUp";
import AppLayout from "./partials/AppLayout";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import Personal from "./pages/Personal";
import Experience from "./pages/experience/Experience";
import Education from "./pages/education/Education";
import Skill from "./pages/skill/Skill";
import Social from "./pages/social/Social";
import Article from "./pages/Article";
import Contact from "./pages/Contact";
import Portfolio from "./pages/portfolio/Porfolio";
import Project from "./pages/project/Project";
import Service from "./pages/service/Service";

function App() {
  return (
    <>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Home />} />
          <Route path="/personal-info" element={<Personal />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/education" element={<Education />} />
          <Route path="/competences" element={<Skill />} />
          <Route path="/articles" element={<Article />} />
          <Route path="/socials" element={<Social />} />
          <Route path="/contacts" element={<Contact />} />
          <Route path="/projects" element={<Project />} />
          <Route path="/services" element={<Service />} />
        </Route>
        <Route path="/porfolio/:id" element={<Portfolio />} />
        <Route path="/signin" element={<SignInSide />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
