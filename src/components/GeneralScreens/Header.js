import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Link, useNavigate } from "react-router-dom";
import SearchForm from './SearchForm';
import '../../Css/Header.css'
import { FaUserEdit } from 'react-icons/fa'
import { FaHistory } from 'react-icons/fa';
import { BiLogOut } from 'react-icons/bi'
import { BsBookmarks } from 'react-icons/bs'
import SkeletonElement from '../Skeletons/SkeletonElement';
import { AuthContext } from '../../Context/AuthContext';
import configData from '../../config.json'
import logo from '../../img/logo.png'
import { FaSearch } from 'react-icons/fa';
import { useMediaQuery } from 'react-responsive';
import slugify from 'slugify';



const Header = () => {
    const isSmallScreen = useMediaQuery({ maxWidth: '1030px' }); // Adjust the max width based on your breakpoint
    const bool = localStorage.getItem("authToken") ? true : false
    const [auth, setAuth] = useState(bool)
    const { activeUser } = useContext(AuthContext)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {

        setAuth(bool)
        setTimeout(() => {
            setLoading(false)
        }, 1600)

    }, [bool])


    const handleLogout = () => {
        localStorage.removeItem("authToken");
        navigate('/')
    };

    const [suggestions, setSuggestions] = useState([])
    const navigateEvent = useMemo(() => new Event('navigateEvent'), []);


  useEffect(() => {
    const handleStorageChange = () => {
      // Update state or take other actions when local storage changes
      const suggestionArray = JSON?.parse(localStorage.getItem('suggestions'));
      setSuggestions(suggestionArray);
    };
  
    // Listen for the custom event
    window.addEventListener('storageChange', handleStorageChange);
  
    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('storageChange', handleStorageChange);
    };
  }, []);
  

  const makeSlug = (title) => {
    return slugify(title, {
        replacement: '-',
        remove: /[*+~.()'"!:@/?]/g,
        lower: true,
        strict: false,
        locale: 'tr',
        trim: true
    })
}
const handleNavigation = (local) => {
    const titleSlug = makeSlug(local)
    navigate(`/story/${titleSlug}`)
    setSuggestions([])
    window.dispatchEvent(navigateEvent);
  }

    return (

        <header>
            <div className="averager">
                <div className='logo_container'>
                <Link to="/">
                    <img src={logo} alt='logo' className="logo"/>
                </Link>
                <h3 style={{color: '#ccc'}}>{`${configData.Name}`}</h3>
                </div>
                <div className="search-wrapper">          
                <SearchForm />
                {suggestions.length > 0? <ul className="suggestion-display">
                {suggestions.map((suggestion, index) => (
                <li key={index} onClick={() => handleNavigation(suggestion?.title)}>{suggestion?.title}</li>
                ))}
                </ul> : ''}
                </div>
                {isSmallScreen && <div style={{display: 'flex', width: '100%',padding: '10px', justifyContent: 'flex-end'}}><FaSearch style={{fontSize: '20px', color: '#333'}} onClick={() => navigate('/search')}/></div>}
                <div className='header_options'>

                    {auth ?
                        <div className="auth_options">


                            <Link className='addStory-link' style={{ color: `${configData.AppColor}`, borderColor: `${configData.AppColor}`}} to="/addstory">AddStory</Link>


                            <Link style={{ color: `${configData.AppColor}`, borderColor: `${configData.AppColor}`}} to="/readList" className='readList-link'>
                                <BsBookmarks />
                                <span id="readListLength" style={{ backgroundColor: `${configData.AppColor}`, boxShadow: `0 0 4px 1px ${configData.AppColor}`}}>
                                    {activeUser.readListLength}
                                </span>
                            </Link>
                            <div className='header-profile-wrapper '>


                                {loading ? <SkeletonElement type="minsize-avatar" />

                                    :

                                    <img src={activeUser.photo} alt={activeUser.username} />

                                }


                                <div className="sub-profile-wrap">
                                    <Link className='profile-link' style={{ 
                                        color: `${configData.AppColor}`, 
                                        borderColor: `${configData.AppColor}`,
                                        }} to="/profile"  > <FaUserEdit />  Profile </Link>
                                    <Link className='profile-link' style={{ 
                                        color: `${configData.AppColor}`, 
                                        borderColor: `${configData.AppColor}`
                                        }} to="/examHistory"  > <FaHistory />  Exam History </Link>

                                    <button className='logout-btn' onClick={handleLogout}> <BiLogOut />  Logout</button>

                                </div>

                            </div>


                        </div>

                        :
                        <div className="noAuth_options">

                            <Link className='login-link' to="/login"> Login </Link>

                            <Link className='register-link' style={{ color: `${configData.AppColor}`, borderColor: `${configData.AppColor}`}} to="/register"> Register</Link>
                        </div>

                    }
                </div>

            </div>

        </header>

    )
}

export default Header;
