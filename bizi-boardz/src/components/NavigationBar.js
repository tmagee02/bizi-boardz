import React, { useState } from "react";
import "../styles/NavigationBar.css";
import "../styles/bizi-boardz-styles.css";
import { Link, useLocation, useMatch, useResolvedPath } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

//currentSprint, View Backlog, My Tasks, Settings
const NavigationBar = () => {

  //if on login page, dont show NavigationBar element
  if (useLocation().pathname === "/") {
    return <></>;
  }

  //the usual render - shows NavigationBar elements
  return (
    <>
      <nav className="nav">
        <div className="app-title">Bizi Boardz</div>
        <ul>
            <CustomLink to="/currentSprint">Current Sprint</CustomLink>
  
        
            <CustomLink to="/viewBacklog">View Backlog</CustomLink>
        
         
            <CustomLink to="/myTasks">My Tasks</CustomLink>
        
       
            <CustomLink to="/settings">Settings</CustomLink>
      
        </ul>
      </nav>
    </>
  );
};

//im pretty sure this gives/takes away active css class,
//giving page name a highlight in the NavigationBar
function CustomLink({ to, children, ...props }) {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });

  return (
    <li className={isActive ? "active" : ""}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  );
}

export default NavigationBar;
