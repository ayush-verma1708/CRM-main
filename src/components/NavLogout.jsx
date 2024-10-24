import './navLogout.css';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

export default function NavLogout() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            // Sign out using Firebase Authentication
            await signOut(auth);

            // Clear local and session storage (optional)
            localStorage.removeItem('authToken');
            sessionStorage.removeItem('userSession');

            // Navigate to the login page
            navigate('/LoginForm');

            // Prevent the user from going back to the dashboard after logging out
            window.history.replaceState(null, null, window.location.href); // Replaces the current entry in the history stack
            window.onpopstate = function () {
                navigate('/LoginForm'); // Forces navigation to login when back is pressed
            };
            
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <div className="navLogout">
            <span onClick={handleLogout}>
                <i className="fa-solid fa-arrow-right-from-bracket fa-rotate-180"></i> Logout
            </span>
        </div>
    );
}