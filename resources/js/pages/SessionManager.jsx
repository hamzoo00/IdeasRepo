import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser } from '../store/slices/userDetailsSlice';

export default function SessionManager({ children }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation(); // Tracks route changes
    
    const currentUser = useSelector((state) => state.auth.user);

    useEffect(() => {

        if (!currentUser) return;

        const EXPIRATION_TIME = 60 * 60 * 1000; // 60 minutes

       
        const checkSession = () => {
            const lastActive = localStorage.getItem('last_active_time');
            if (lastActive) {
                const timePassed = Date.now() - parseInt(lastActive, 10);
                
                if (timePassed > EXPIRATION_TIME) {
                    dispatch(clearUser());
                    alert("Your session has expired due to inactivity.");
                    navigate('/', { replace: true });
                }
            }
        };

        const updateActivity = () => {
            localStorage.setItem('last_active_time', Date.now().toString());
        };

        checkSession();
        updateActivity();

        //Check the clock every 1 min in the background
        const interval = setInterval(checkSession, 60 * 1000);

        const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
        events.forEach(event => window.addEventListener(event, updateActivity));

        // Cleanup function when component unmounts
        return () => {
            clearInterval(interval);
            events.forEach(event => window.removeEventListener(event, updateActivity));
        };
    }, [currentUser, location.pathname, dispatch, navigate]);

    return children;
}