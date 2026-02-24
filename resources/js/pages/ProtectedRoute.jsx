import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
   
    const token = sessionStorage.getItem('auth_token');

    if (!token) {
        sessionStorage.setItem('redirect_after_login', location.pathname + location.search);
        return <Navigate to="/" replace />;
    }

    
    return children;
}