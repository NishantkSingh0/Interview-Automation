import { useState, useEffect } from 'react'
import { Toaster } from "react-hot-toast";
import { AnimatePresence } from "framer-motion";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from "./components/Others/practice.jsx";
import StudentLogin from "./components/studentLogin.jsx";
import OrgLogin from "./components/OrgLogin.jsx";
import CandidateLogin from "./components/candLogin.jsx";
import Animate from "./components/AnimatePages.jsx"
import OrgDashboard from './components/OrgDashboard.jsx';
import EmailValidation from './components/EmailLoginPage.jsx';
import HomePage from './components/HomePage.jsx';
import WhatNew from './components/WhatsNew.jsx';
import ScreenWarning from './components/Others/NoMob.jsx';
import ScheduleInterview from "./components/LLMSchedular.jsx";
import InterviewRulesPage from "./components/RulesPage.jsx";
import AddCandidateBatch from "./components/AddCandidatesBatch.jsx";
import PricingPage from './components/PricingPage.jsx';
import StdDashboard from './components/StdDashboard.jsx';
import PreInterviewCheck from "./components/Cam.jsx";
import ExamPage from "./components/ExamPage.jsx";



function App() {
  const backendURL=import.meta.env.VITE_BACKEND_URL || "https://interview-automation.onrender.com";   
  
  // Wakeup
  useEffect(() => {
      fetch(`${backendURL}/`)
        .catch(() => {});
  }, [backendURL]);

  return (
    // <>
    //     <EmailValidation/>
    // </>
    <div className="relative min-h-screen bg-gray-900">
      <AnimatePresence mode="wait">
        <Toaster position="top-right" reverseOrder={false} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* <Route path="/Login" element={<Animate><LoginUi /></Animate>} /> */}
          <Route path="/Student" element={<Animate><StudentLogin /></Animate>} />
          <Route path="/Student/StdDashboard" element={<Animate><StdDashboard /></Animate>} />
          <Route path="/WhatsNew" element={<Animate><WhatNew /></Animate>} />
          <Route path="/Candidate" element={<Animate><CandidateLogin /></Animate>} />
          <Route path="/Organization" element={<Animate><OrgLogin /></Animate>} />
          <Route path="/EmailVerification" element={<Animate><EmailValidation /></Animate>} />
          <Route path="/Pricings" element={<Animate><PricingPage /></Animate>} />
          <Route path="/Organization/OrgDashboard" element={<Animate><OrgDashboard /></Animate>} />
          <Route path="/Organization/Add_Candidates" element={<Animate><AddCandidateBatch /></Animate>} />
          <Route path="/Interview" element={<Animate><ScheduleInterview /></Animate>} />
          <Route path="/verification" element={<Animate><PreInterviewCheck /></Animate>} />
          <Route path="/exam" element={<Animate><ExamPage /></Animate>} />
        </Routes>
      </AnimatePresence>
    </div>
  )
}

export default App;
