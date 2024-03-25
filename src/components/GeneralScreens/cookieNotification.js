import React, { useEffect, useState } from 'react';
import '../../Css/cookieNotification.css';
import cookie from '../../img/cookie.png'

const CookieNotification = () => {
  const [showNotification, setShowNotification] = useState(true);
  const [cookiesAccepted, setCookieAccepted] = useState(true)
  useEffect(() => {
    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    setCookieAccepted(cookiesAccepted)
    if (cookiesAccepted) {
      setShowNotification(false);
    }
  }, []);

  const acceptCookies = () => {
    setShowNotification(false);
    localStorage.setItem('cookiesAccepted', 'true');
  };
  const rejectCookies = () => {
    setShowNotification(false);
    localStorage.setItem('cookiesAccepted', 'false');
    // Handle cookie rejection (e.g., delete existing cookies)
  };

  return (
    showNotification && !cookiesAccepted && (
      <div id="cookie-notification">
        <img src={cookie} alt='cookie'/>
        <p>
          We value your privacy! This website uses cookies to enhance your browsing experience. Cookies are small text files stored on your device that help us understand how you interact with our site.
        </p>
        <p>
          By continuing to use our website, you consent to the use of these cookies. You can learn more about our cookie policy in our <a style={{color: 'green'}} href="/privacy-policy">Privacy Policy</a>.
        </p>
        <div className='button-wrapper'>
        <button onClick={rejectCookies}>Reject</button>
        <button onClick={acceptCookies}>Accept</button>
        </div>

      </div>
    )
  );
};

export default CookieNotification;
