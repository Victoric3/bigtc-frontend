import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../Css/Header.css";
import { FaUserEdit } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { BsBookmarks } from "react-icons/bs";
import SkeletonElement from "../Skeletons/SkeletonElement";
import { AuthContext } from "../../Context/AuthContext";
import configData from "../../config.json";
import logo from "../../img/logo.jpg";
import { useMediaQuery } from "react-responsive";
import navLinks from "../utilities/navLinks";
import downArrow from "../../img/downarrow.png";
import { BiPhoneOutgoing } from "react-icons/bi";
import { BiMenu, BiX } from "react-icons/bi";
import Drawer from "./Drawer";

const Header = () => {
  const isSmallScreen = useMediaQuery({ maxWidth: "600px" }); // Adjust the max width based on your breakpoint
  const bool = localStorage.getItem("authToken") ? true : false;
  const [auth, setAuth] = useState(bool);
  const { activeUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setAuth(bool);
    setTimeout(() => {
      setLoading(false);
    }, 1600);
  }, [bool]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

  const [showChildren, setShowChildren] = useState(false);
  const [activeIndex, setActiveIndex] = useState("");
  const [dotVisible, setDotVisible] = useState(true);
  const handleHover = (index) => {
    setActiveIndex(index);
    setShowChildren(true);
    setDotVisible(true);
  };

  ///for mobile
  const [showDrawer, setShowDrawer] = useState(false);
  return (
    <header
      style={{
        display: "flex",
        flexDirection: "column",
        background: configData.baseColor,
      }}
    >
      <div className="averager">
        <div className="header_options">
          <div className="logo_container" onClick={() => navigate("/")}>
            <Link to="/">
              <img src={logo} alt="logo" className="logo" />
            </Link>
            <h2
              style={{ color: configData.whiteColor, cursor: "pointer" }}
            >{`${configData.Name}`}</h2>
            <div
              className="logo-touch"
              style={{ backgroundColor: configData.AppColor }}
            ></div>
          </div>

          {isSmallScreen ? (
            <>
              {showDrawer ? (
                <BiX
                  fontSize="30px"
                  onClick={() => setShowDrawer(false)}
                  color={configData.whiteColor}
                />
              ) : (
                <BiMenu
                  fontSize="30px"
                  onClick={() => setShowDrawer(true)}
                  color={configData.whiteColor}
                />
              )}
            </>
          ) : (
            <div className="nav_link_container">
              {navLinks.map((navLink, index) => {
                return (
                  <div key={index} className="nav_link">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "2px",
                      }}
                      onClick={() => {
                        navLink.children
                          ? setShowChildren(true)
                          : navigate(`${navLink.navLink}`);
                      }}
                      onMouseEnter={() => handleHover(index)}
                      onMouseLeave={() => {
                        setDotVisible(false);
                      }}
                    >
                      {activeIndex === index && dotVisible && (
                        <div
                          className="logo-touch"
                          style={{ backgroundColor: configData.AppColor }}
                        ></div>
                      )}
                      <h2 style={{ color: configData.whiteColor }}>
                        {index === navLinks.length - 1 && <BiPhoneOutgoing />}
                        {` ${navLink.navName}`}
                        {navLink.children && (
                          <img
                            src={downArrow}
                            alt="downArrow"
                            style={{
                              width: "20px",
                              height: "auto",
                            }}
                          />
                        )}
                      </h2>
                    </div>
                    {showChildren && activeIndex === index ? (
                      <div className="accordion_content">
                        {navLink?.children?.map((childNavLink, childIndex) => (
                          <div
                            key={childIndex}
                            className="nav_link"
                            onClick={() => navigate(`${childNavLink.navLink}`)}
                          >
                            <img
                              src={childNavLink.img}
                              alt={`${childNavLink.navName}`}
                            />
                            <h2 style={{ color: "#333" }}>
                              {childNavLink.navName}
                            </h2>
                          </div>
                        ))}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {activeUser?.admin ? (
            <>
              {auth ? (
                <div className="auth_options">
                  <Link
                    className="addStory-link"
                    style={{
                      color: `${configData.AppColor}`,
                      borderColor: `${configData.AppColor}`,
                    }}
                    to="/addstory"
                  >
                    AddStory
                  </Link>

                  <Link
                    style={{
                      color: `${configData.AppColor}`,
                      borderColor: `${configData.AppColor}`,
                    }}
                    to="/readList"
                    className="readList-link"
                  >
                    <BsBookmarks />
                    <span
                      id="readListLength"
                      style={{
                        backgroundColor: `${configData.AppColor}`,
                        boxShadow: `0 0 4px 1px ${configData.AppColor}`,
                      }}
                    >
                      {activeUser.readListLength}
                    </span>
                  </Link>
                  <div className="header-profile-wrapper ">
                    {loading ? (
                      <SkeletonElement type="minsize-avatar" />
                    ) : (
                      <img src={activeUser.photo} alt={activeUser.username} />
                    )}

                    <div className="sub-profile-wrap">
                      <Link
                        className="profile-link"
                        style={{
                          color: `${configData.AppColor}`,
                          borderColor: `${configData.AppColor}`,
                        }}
                        to="/profile"
                      >
                        {" "}
                        <FaUserEdit /> Profile{" "}
                      </Link>
                      <button className="logout-btn" onClick={handleLogout}>
                        {" "}
                        <BiLogOut /> Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="noAuth_options">
                  <Link className="login-link" to="/login">
                    {" "}
                    Login{" "}
                  </Link>

                  <Link
                    className="register-link"
                    style={{
                      color: `${configData.AppColor}`,
                      borderColor: `${configData.AppColor}`,
                    }}
                    to="/register"
                  >
                    {" "}
                    Register
                  </Link>
                </div>
              )}
            </>
          ) : (
            ""
          )}
        </div>
      </div>
      {isSmallScreen && showDrawer ? <Drawer /> : ""}
    </header>
  );
};

export default Header;
