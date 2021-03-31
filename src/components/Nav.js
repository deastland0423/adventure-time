import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AppConfig from '../config';
import { useUserContext, logout, loginSuccess, setAccessRules } from "../contexts/UserContext";

const Nav = () => {
    const { auth, dispatch } = useUserContext();
    useEffect(() => {
      // On first page load, check to see if our login cookie is still good.
      const config = {
          method: 'get',
          url: `${AppConfig.backend_host}/login`,
          withCredentials: true
      }
      axios(config).then((response) => {
        console.log('getLogin response: ', response.data);
          dispatch(loginSuccess(response.data.user));
        })
      .catch((err) => {
        console.log("getLogin error",err);
      });
      // Also, load up access rules from BE.
      axios.get(`${AppConfig.backend_host}/access-rules`).then((response) => {
        let accessRules = response.data;
        Object.keys(accessRules).map(route => {
          if (accessRules[route].startsWith('(req) => ')) {
            const functionAsString = accessRules[route].slice('(req) => '.length);
            const functionBody = 'return '+functionAsString;
            accessRules[route] = new Function('req', functionBody);
          } else {
            console.log("ERROR: Could not parse function body from: ",accessRules[route]);
          }
        })
        dispatch(setAccessRules(accessRules));
      })
      .catch((err) => {
        console.log("Couldn't load access-rules:",err);
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
                            <Link to="/my-account" className="nav-link"><nobr>👤 {auth.user.username}</nobr></Link>
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