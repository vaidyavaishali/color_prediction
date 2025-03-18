import React from "react";
import { Routes, Route } from "react-router";
import "./App.css";
import Color from "./Color/Color";
import UserLogin from "./UserLogin/UserLogin";
import RegistrationPage from "./UserLogin/SignUp";
import {ProfileProvider} from "./context/ProfileContext";
const App = () => {
  return (
    <>
     <ProfileProvider>
      <Routes>
      <Route path="/" element={<RegistrationPage/>}></Route>
        <Route path="/login" element={<UserLogin />} />
        <Route path ="/color" element={<Color />} />
        {/* <Route path ="/admin/random-numbers" element={<AdminRandomNumbers />} />
        <Route path ="/admin/manage-bets" element={<GetBetData />} />
        <Route path ="/admin/refaral-codes" element={<AdminReferralCodes />} />
        <Route path ="/admin/login" element={<AdminLogin />} />
        <Route path ="/admin/dashboard" element={<DashBoard />} /> */}
      </Routes>
      </ProfileProvider>
    </>
  )
}

export default App

