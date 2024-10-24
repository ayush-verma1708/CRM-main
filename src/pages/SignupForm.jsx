import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import './signup.css'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignupForm = () => {
  const [key, setKey] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();

  const signUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (key !== 'xDhyzPLa'){
      toast.error('Secret key does not match');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      toast.success('Signup successful. Redirecting to dashboard...');
      setTimeout(() => {
        navigate('/Dashboard');
      }, 2000);
    } catch (error) {
      toast.error('Failed to sign up. Please check your details and try again.');
    }
  };
  return (
    <div className='signup-container'>
      <ToastContainer position="top-center"/>
      <div className="signup-form">
      <h2 className='signup-head'>Create Account</h2>
        <form onSubmit={signUp}>
            <label className='signup-label'>
              Secret Key
              <input className="signup-input" 
                type="password" 
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder='Enter secret key'
                required
              />
            </label>
            <label className='signup-label'>
              Email
              <input className='signup-input'
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='Enter your email'
                required
              />
            </label>
            <label className='signup-label'>
              Password
              <input className='signup-input'
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Enter the password'
                required
              />
            </label>
            <label className='signup-label'>
              Confirm Password
              <input className='signup-input'
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder='Re-enter the password'
                required
              />
            </label>
          <button type="submit" className="signupBtn">Sign Up</button>
        </form>
        <div className='signup-optn'>Already have an account? <a href="./">Login</a></div>
        </div>
    </div>
  );
};

export default SignupForm;