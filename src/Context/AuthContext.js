import React, { useState, useEffect } from "react";
import instance from "./axiosConfig";

export const AuthContext = React.createContext();

const AuthContextProvider = props => {
  const [activeUser, setActiveUser] = useState({})
  const [config, setConfig] = useState({
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  })


  useEffect(() => {

    const controlAuth = async () => {
      try {
        const { data, status } = await instance.get("/auth/private", config);
        setActiveUser(data.user)
        if(status === 401){
          localStorage.removeItem("authToken");
        }
      }
      catch (error) {
        setActiveUser({})
      }
    };
    controlAuth()

  }, [config])

  return (
    <AuthContext.Provider value={{ activeUser, setActiveUser, config, setConfig }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
