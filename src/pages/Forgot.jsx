import { useState } from 'react';
import { auth } from '../firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import './forgot.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Forgot() {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent. Check your inbox.');
    } catch (error) {
      toast.error('Failed to send password reset email. Please check the email address.');
    }
  };

  return (
    <div className='forgot-container'>
      <ToastContainer position="top-center"/>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <h2 className='forgot-head'>Forgot Password?</h2>
          <p className='forgot-p'>Please enter your email address below</p>
          <label className='forgot-label'>Email</label>
          <input className='forgot-input'
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Enter your email'
            required
          />
          <button type="submit" className='forgot-btn'>Reset Password</button>
          <br/>
          <div className='login-submit'><a href="./">Back to Login</a></div>
        </div> 
      </form> 
    </div>
  )
}

export default Forgot;