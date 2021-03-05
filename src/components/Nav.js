import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUserContext, logout, loginSuccess } from "../contexts/UserContext";
import axios from 'axios';
import AppConfig from '../config';

const Nav = () => {
    const { auth, dispatch } = useUserContext();
    useEffect(() => {
      // On first page load, check to see if our login cookie is still good.
      const url = `${AppConfig.backend_host}/login`;
      const config = {
          method: 'get',
          url: url,
          withCredentials: true
      }
      axios(config).then((response) => {
        console.log('getLogin response: ', response.data);
          dispatch(loginSuccess(response.data.user));
        })
      .catch((err) => {
        console.log("getLogin error",err);
      });
    }, []);

    const handleLogout = async (e) => {
        e.preventDefault();
        // Send logout to BE
        const url = `${AppConfig.backend_host}/logout`;
        const config = {
            method: 'post',
            url: url,
            withCredentials: true
        }
        try {
            const response = await axios(config);
            console.log('Logout response: ', response.data);
            // Handle UI logout
            dispatch(logout());
        } catch (err) {
            console.log("Logout failed",err)
        }
    }

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
                            <a href="#" onClick={handleLogout} className="nav-link">Logout</a>
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