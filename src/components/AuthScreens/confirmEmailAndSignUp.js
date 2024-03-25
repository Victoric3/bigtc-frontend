import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Loader from '../GeneralScreens/Loader'
import configData from '../../config.json'
import logo from '../../img/logo.png'
import '../../Css/confirmEmail.css'



const ConfirmEmailAndSignUp = () => {
  let { token } = useParams();
  const navigate = useNavigate()
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const confirmEmailAndSignUp = async (token) => {
    try {
      const response = await fetch(`${configData.baseUrl}/auth/confirmEmailAndSignUp/${token}`,{
        method: 'POST'
      })
      const data = await response.json();
      if (response.ok) {
        setSuccess(data.message);
      } 
      if(!response.ok) {
        setError(data.errorMessage);
        setTimeout(() => {
          setError("");
        }, 5000);
      }
    } catch (error) {
      setError('Error confirming email and sign-up: ' + error.message);
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };


  let lastCallTime = 0;
  
  const resendVerificationToken = async (token) => {
    const currentTime = new Date().getTime();
    const elapsedTime = currentTime - lastCallTime;

    if (elapsedTime < 60000) { // 1 minute in milliseconds
      setError('Please wait for 1 minute before requesting the verification token.');
      setTimeout(() => {
        setError("");
      }, 5000);
      return;
    }
    try {
      const response = await fetch(`${configData.baseUrl}/auth/resendVerificationToken/${token}`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (response.ok) {
        const data = await response.json();
        setSuccess(data.message);
        lastCallTime = currentTime;
      } else {
        const data = await response.json();
        setError(data.errorMessage);
        setTimeout(() => {
          setError("");
        }, 5000);
      }
    } catch (error) {
      setError('Error resending verification token: ' + error.message);
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  useEffect(() => {
    confirmEmailAndSignUp(token);
  }, [token]);
  return (
    <div className='email-template-container'>
      {token === 'null' && !success && (
    <div className='email-template-null'>
      <div style={{
        display: 'flex',
        alignItems: 'center',
      }}>
      <img src={logo} alt='logo'style={{width: 'auto', height: '70px'}}/>
      </div>
      <h4 style={{ fontSize: '24px', color: '#000' }}>Confirm Your Email</h4>
      <p style={{ color: '#555', textAlign: 'center' }}>
        An email has been sent to your inbox. Please proceed to confirm your email by clicking the provided link.
      </p>
      <p style={{ color: '#555' }}>
        Here are the next steps:
      </p>
      <ul style={{ textAlign: 'left', color: '#555', listStyleType: 'square' }}>
        <li>Check your email for a message from us.</li>
        <li>Click on the confirmation link in the email.</li>
        <li>Once confirmed, you'll be ready to log in and access your account.</li>
        <li>if you didn't receive an email, Check your spam folder</li>
      </ul>
    </div>
  )}
    


      {token === 'null' || success || error ? null : (
        <div className='email-template-verify'>
          <div style={{
            display: 'flex',
            alignItems: 'center',
          }}>
          <img src={logo} alt='logo'style={{width: 'auto', height: '70px'}}/>
  
          </div>
          <p style={{ fontSize: '20px', color: '#555' }}>Verifying Your Email</p>
          <Loader color='#ccc' />
        </div>
      )}
    



      {token !== 'null' && !error && success && (
        <div className='email-template'>
          <div style={{
            display: 'flex',
            alignItems: 'center',
          }}>
          <img src={logo} alt='logo'style={{width: 'auto', height: '70px'}}/>
          </div>
          <h4 style={{ fontSize: '24px', color: '#000' }}>Email Confirmation Successful</h4>
          <p style={{ color: '#555', textAlign: 'center' }}>
            {success}
          </p>
          <p
            onClick={() => navigate('/login')}
            style={{ color: '#007BFF', cursor: 'pointer', textAlign: 'right', border: '1px solid #fadedf', padding: '5px' }}>
            Log In
          </p>
        </div>
      )}
    





      {token !== 'null' && error && (
        <div className='email-template'>
          <div style={{
            display: 'flex',
            alignItems: 'center',
          }}>
          <img src={logo} alt='logo'style={{width: 'auto', height: '70px'}}/>
  
          </div>
          <h4 style={{ fontSize: '24px', color: 'red' }}>Email Confirmation Failed</h4>
          <p style={{ color: 'red' }}>{error}</p>
          <div style={{
            marginTop: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            padding: '2px',
            width: '100%',
          }}>
            <div>
              <p
                onClick={() => navigate('/login')}
                className='email-template-button'>
                Log In
              </p>
            </div>
            <div>
              <p
                onClick={() => resendVerificationToken(token)}
                style={{ color: '#007BFF', cursor: 'pointer', border: '1px solid #fadedf', padding: '5px' }}>
                Resend Token
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
    
    
  );
};

export default ConfirmEmailAndSignUp;
