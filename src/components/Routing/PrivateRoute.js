import { useEffect,useState,useContext } from 'react';
import {Outlet, useNavigate} from 'react-router-dom'
import Home from '../GeneralScreens/Home';
import instance from '../../Context/axiosConfig';
import { AuthContext } from "../../Context/AuthContext";

const PrivateRoute =( ) => {
    const bool =localStorage.getItem("authToken") ? true :false
    const [auth ,setAuth] =useState(bool)
    const navigate = useNavigate()
    const {setActiveUser,setConfig } = useContext(AuthContext)

    useEffect(() => {

       const controlAuth = async () => {
        const config = {
            headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
        };
        try {
            const response = await instance.get("/auth/private", config); 

            setAuth(true)
            setActiveUser(response.data.user)
            setConfig(config)

        } 
        catch (error) {
            if(error?.response?.status === 400){
                alert('you need to login to access this route')
                navigate('/')
            }else if(error?.response?.status === 401){
                setAuth(false)
                setActiveUser({})
                alert('seasoned time out, please login')
                localStorage.removeItem("authToken");
                setTimeout(() => {
                    navigate('/login')
                }, 3000)
            }else{
                alert('you need to login to access this route')
                navigate('/')
            }


        }
        };

        controlAuth()
    }, [bool,navigate, setConfig, setActiveUser])


    return (auth ? <Outlet />  : <Home />)
}

export default PrivateRoute;
