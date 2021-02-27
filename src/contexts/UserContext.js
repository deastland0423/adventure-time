import React, { createContext, useReducer, useContext } from "react";

export const UserContext = createContext();

// Initial state
const initialState = {
  isLoggedIn: false,
  user: null,
  error: null
};

// Actions
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAIL = "LOGIN_FAIL";
export const LOGOUT = "LOGOUT";

// Action creators
export function loginSuccess(user) {
  return { type: LOGIN_SUCCESS, user };
}

export function loginFail(error) {
  return { type: LOGIN_FAIL, error };
}

export function logout() {
  return { type: LOGOUT };
}

// Reducer
export function authReducer(state, action) {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return { isLoggedIn: true, user: action.user, error: null };
    case LOGIN_FAIL:
      return { isLoggedIn: false, user: null, error: action.error };
    case LOGOUT:
      return { isLoggedIn: false, user: null, error: null };
    default:
      return state;
  }
}

function UserProvider(props) {
  const [auth, dispatch] = useReducer(authReducer, initialState);

  const authData = { auth, dispatch };

  return <UserContext.Provider value={authData} {...props} />;
}

function useUserContext() {
  return useContext(UserContext);
}

export { UserProvider, useUserContext };