import React from 'react';
import { Routes, Route } from 'react-router-dom';

import SignIn from '../pages/SignIn/SignIn';
import TeacherSignIn from '../pages/SignIn/TeacherSignIn';
import SignUp from '../pages/SignUp/SignUp';
import StudentProfile from '../pages/Profiles/StudentProfile';
import TeacherProfile from '../pages/Profiles/TeacherProfile';
import AdminProfile from '../pages/Profiles/AdminProfile';
import Home from '../pages/Home/Home';
import ContactUs from '../pages/ContactUs/ContactUs';


export default function App() {
    return (
       
        <Routes>
            <Route path="/" element={<SignIn />} />
            <Route path="/teacherSignIn" element={<TeacherSignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/:name/:id/profile" element={<StudentProfile />} />
            <Route path="/:name/:id/profile" element={<TeacherProfile />} />
            <Route path="/admin/:id" element={<AdminProfile />} />
            <Route path="/:name/:id/home" element={<Home />} />
            <Route path="/contactUs" element={<ContactUs />} />
        </Routes>
    );
}
