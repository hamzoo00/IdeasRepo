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
import ProtectedRoute from './ProtectedRoute';
import SessionManager from './SessionManager';


export default function App() {
    return (
       
        <SessionManager> 
         <Routes>
           
           {/* Public Routes */}
            <Route path="/" element={<SignIn />} />
            <Route path="/teacherSignIn" element={<TeacherSignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/contactUs" element={<ContactUs />} />

            {/* Protected Routes */}
            <Route path="/:name/:id/profile" element={
                <ProtectedRoute>
                   <StudentProfile />
                </ProtectedRoute> 
            }
            />
            <Route path="/:name/:id/teacher/profile" element={
                <ProtectedRoute>
                   <TeacherProfile />
                </ProtectedRoute> 
            } 
            />
            <Route path="/:id/admin/profile" element={
                <ProtectedRoute>
                   <AdminProfile />
                </ProtectedRoute> 
            }
            />    
             <Route path="/:name/:id/home" element={
                <ProtectedRoute>
                    <Home />
                </ProtectedRoute>
             } />
        
         </Routes>
        </SessionManager>
    );
}
