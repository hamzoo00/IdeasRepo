import React from 'react';
import { Routes, Route } from 'react-router-dom';

import SignIn from '../pages/SignIn/SignIn';
import TeacherSignIn from '../pages/SignIn/TeacherSignIn';
import SignUp from '../pages/SignUp/SignUp';
import StudentProfile from '../pages/Profiles/StudentProfile';
import TeacherProfile from '../pages/Profiles/TeacherProfile';
import AdminProfile from '../pages/Profiles/AdminProfile';


export default function App() {
    return (
       
        <Routes>
            <Route path="/" element={<SignIn />} />
            <Route path="/teacherSignIn" element={<TeacherSignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/student/:id" element={<StudentProfile />} />
            <Route path="/teacher/:id" element={<TeacherProfile />} />
            <Route path="/admin/:id" element={<AdminProfile />} />
           
        </Routes>
    );
}
