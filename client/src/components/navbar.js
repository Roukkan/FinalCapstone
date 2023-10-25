import { Link, NavLink } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import NavbarCSS from "./navbar.module.css";
import { MdTableRows } from "react-icons/md";
import Logo from "../image/KK3white.png";

export const Navbar = () => {
  const [cookies, setCookies] = useCookies(["access_token"]);

  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  const logout = () => {
    setCookies("access_token", "");
    window.localStorage.removeItem("userID");
    navigate("/auth");
  };

  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef(null);

  useEffect(() => {
    const closeMenuOnScreenTouch = (event) => {
      if (
        menuButtonRef.current &&
        menuOpen &&
        !menuButtonRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("click", closeMenuOnScreenTouch);

    return () => {
      document.removeEventListener("click", closeMenuOnScreenTouch);
    };
  }, [menuOpen]);

  return (
    <nav>
      <div className={NavbarCSS.KK}>
        <Link to="/" className={NavbarCSS.title} onClick={scrollToTop}>
          <img src={Logo} alt="KitchenKonnect" className={NavbarCSS.logo} />
        </Link>
      </div>

      <button
        ref={menuButtonRef}
        className={NavbarCSS.menuBtn}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <MdTableRows className={NavbarCSS.burger} />
      </button>

      <ul className={menuOpen ? NavbarCSS.open : ""}>
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        <li>
          {!cookies.access_token ? (
            <></>
          ) : (
            <>
              <NavLink className={NavbarCSS.links} to="/create-recipe">
                Create Recipe
              </NavLink>
            </>
          )}
        </li>
        <li>
          {!cookies.access_token ? (
            <></>
          ) : (
            <>
              <NavLink to="/saved-recipe">Saved Recipes</NavLink>
            </>
          )}
        </li>
        <li>
          {!cookies.access_token ? (
            <NavLink to="/auth"> Login/Register</NavLink>
          ) : (
            <>
              <NavLink to="/auth" onClick={logout}>
                Logout
              </NavLink>
            </>
          )}
        </li>
      </ul>
    </nav>
  );
};
