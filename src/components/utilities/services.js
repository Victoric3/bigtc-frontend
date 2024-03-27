import React from "react";
import { Link } from "react-router-dom"; // Assuming you're using React Router for navigation
import navLinks from "../utilities/navLinks";

const ServicesComponent = () => {
  const containerStyle = {
    display: "flex",
    flexWrap: "noWrap",
    justifyContent: "flex-start",
    width: "100%",
    overflowX: "auto",
  };

  const serviceItemStyle = {
    textDecoration: "none",
    textAlign: "center",
    margin: "10px",
    width: "200px",
  };

  const serviceIconStyle = {
    width: "100px",
    height: "100px",
    borderRadius: "10px",
  };

  const serviceNameStyle = {
    fontSize: "18px",
    fontWeight: "bold",
    marginTop: "10px",
  };

  return (
    <div style={containerStyle}>
      {navLinks[1].children.map((service, index) => (
        <Link to={service.navLink} key={index} style={serviceItemStyle}>
          <img
            src={service.img}
            alt={service.navName}
            style={serviceIconStyle}
          />
          <p style={serviceNameStyle}>{service.navName}</p>
        </Link>
      ))}
    </div>
  );
};

export default ServicesComponent;
