import React, { useState } from "react";
import {
  useUserContext,
  loginSuccess,
  loginFail,
  logout
} from "../contexts/UserContext";
//import { doLogin } from "../api/auth";

export default function UserMenu() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { auth, dispatch } = useUserContext();

  // Handle login will call the login API and dispatch actions
  // depending on the result
  async function handleLogin() {
    setLoading(true);
    try {
        //TODO:DUMMY LOGIN
        if(email !== password) {
            throw Error("email and password don't match")
        }
      //TODO await doLogin(user_id);
      setLoading(false);
      dispatch(loginSuccess({email_address: email, user_id: (isNaN(email) ? 1 : email)}));
    } catch (error) {
      setLoading(false);
      dispatch(loginFail(error.message));
    }
  }

  async function handleLogout() {
      dispatch(logout());
  }

  // If user is already logged in redirect to Todos page
  if (auth.isLoggedIn) {
      return (
          <div>
              Hello User #{auth.user.user_id}
              <button onClick={(e) => {e.preventDefault(); handleLogout();}}>Logout</button>
          </div>
      );
  }

  if (loading) return <p>Loading..</p>;

  return (
    <div>
      <h2>Login</h2>
      <div>
        <input
          type="email"
          placeholder="E-mail address"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
      </div>
      {auth.error && <p className="error message">{auth.error}</p>}
    </div>
  );
}