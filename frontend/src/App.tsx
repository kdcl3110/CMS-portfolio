import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import SignInSide from "./pages/signin/SignInSide";
import SignUp from "./pages/signup/SignUp";
import AppLayout from "./partials/AppLayout";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import Personal from "./pages/Personal";
import Experience from "./pages/Experience";
import Education from "./pages/Education";
import Competence from "./pages/Competence";
import Social from "./pages/Social";
import Article from "./pages/Article";
import Contact from "./pages/Contact";

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
          <Route path="/competences" element={<Competence />} />
          <Route path="/articles" element={<Article />} />
          <Route path="/socials" element={<Social />} />
          <Route path="/contacts" element={<Contact />} />
        </Route>
        <Route path="/porfolio/:id" element={<>Je suis la</>} />
        <Route path="/signin" element={<SignInSide />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
