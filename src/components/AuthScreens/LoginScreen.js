import { useState } from "react";
import "../../Css/Login.css"
import { Link, useNavigate } from "react-router-dom";
import configData from '../../config.json'
import Loader from "../GeneralScreens/Loader";

const LoginScreen = () => {
  const [identity, setIdentity] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()


  const loginHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true)
    try {
      const response = await fetch(`${configData.baseUrl}/auth/login`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identity, password })}
        );
        
        const data = await response.json()
        if(response.ok){
          setIsLoading(false)
          setSuccess(data.message)
          localStorage.setItem("authToken", data.token);
          setTimeout(() => {
          navigate('/');
        }, 1800)
        setTimeout(() => {
          setSuccess("");
        }, 6000);
      }
      if(!response.ok){
        setIsLoading(false)
        setError(data.errorMessage)
        setTimeout(() => {
          setError("");
        }, 6000);
      }

    } catch (error) {
      setIsLoading(false)
      setError(`something went wrong: ${error}`);
      setTimeout(() => {
        setError("");
      }, 4500);

    }
  };

  return (
    <div className="Inclusive-login-page">

      <div className="login-big-wrapper">

        <div className="section-wrapper">

          <div className="top-suggest_register">

            <span>Don't have an account? </span>
            <a href="/register">Sign Up</a>

          </div>

          <div className="top-login-explain">
            <h2>Login to Your Account </h2>

            <p>
              Please Login Your Account, Thank You!
            </p>


          </div>


          <form onSubmit={loginHandler} >
            {error && <div className="error_message">{error}</div>}
            {success && <div className="success_message">{success}</div>}
            <div className="input-wrapper">
              <input
                type="string"
                required
                id="identity"
                placeholder="example@gmail.com"
                onChange={(e) => setIdentity(e.target.value.trim())}
                value={identity}
                tabIndex={1}
              />
              <label htmlFor="identity">Email or username</label>

            </div>
            <div className="input-wrapper">

              <input
                type="password"
                required
                id="password"
                autoComplete="true"
                placeholder="6+ strong character"
                onChange={(e) => setPassword(e.target.value.trim())}
                value={password}
                tabIndex={2}
                />
              <label htmlFor="password">
                Password

              </label>
            </div>
            <Link to="/forgotpassword" className="login-screen__forgotpassword"> Forgot Password ?
            </Link>
            <button type="submit" >
              Login
            </button>
            {isLoading && <Loader />}

          </form>


        </div>

        <div className="login-banner-section ">

          <img src="login.png" alt="banner" width="400px" />
        </div>

      </div>


    </div>


  );
};

export default LoginScreen;