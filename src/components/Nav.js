import React from 'react';
import { Link } from 'react-router-dom';
import { useUserContext, logout } from "../contexts/UserContext";

const Nav = () => {
    const { auth, dispatch } = useUserContext();
    return (
        <nav className="navbar navbar-expand-md navbar-dark bg-dark mb-4">
            <div className="container-fluid">
                <Link to="/" className="navbar-brand">Home</Link>
            </div>
            <div>
                {auth.isLoggedIn ?
                    <ul className="navbar-nav me-auto mb-2 mb-md-0">
                        <li className="nav-item">
                            <a className="nav-link" href="#"><nobr>👤 {auth.user.username}</nobr></a>
                        </li>
                        <li className="nav-item">
                            <a href="#" onClick={(e) => {e.preventDefault(); dispatch(logout());}} className="nav-link">Logout</a>
                        </li>
                    </ul>
                    :
                    <ul className="navbar-nav me-auto mb-2 mb-md-0">
                        <li className="nav-item">
                            <Link to="/login" className="nav-link">Login</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/register" className="nav-link">Register</Link>
                        </li>
                    </ul>
                }
            </div>
        </nav>            
    );
};

export default Nav;