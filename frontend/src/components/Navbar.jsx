import React from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/nav_logo.webp"; 

const Navbar = () => {
    return (
        <header className="navbar">
            <div className="logo-container">
                <img src={Logo} alt="COSC" />
                <h2> <i>7eam 7</i></h2>
            </div>
            <nav>
                <ul className="nav">
                    <li>
                        <Link to="/" className="nav-link">
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link to="/library" className="nav-link">
                            Library
                        </Link>
                    </li>
                    <li>
                        <Link to="/dashboard" className="nav-link">
                            Dashboard
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Navbar;
