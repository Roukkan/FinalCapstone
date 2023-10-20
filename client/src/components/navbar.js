import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import NAVBARCSS from "../components/navbar.module.css";

export const Navbar = () => {
  const [cookies, setCookies] = useCookies(["access_token"]);
  const navigate = useNavigate();
  const logout = () => {
    setCookies("access_token", "");
    window.localStorage.removeItem("userID");
    navigate("/auth");
  };
  return (
    <div className={NAVBARCSS.navbar}>
      <Link to="/">Home</Link>

      {!cookies.access_token ? (
        <Link to="/auth"> Login/Register</Link>
      ) : (
        <>
          <Link to="/create-recipe">Create Recipe</Link>
          <Link to="/saved-recipe">Saved Recipes</Link>
          <button onClick={logout} className={NAVBARCSS.login}>
            Logout
          </button>
        </>
      )}
    </div>
  );
};
