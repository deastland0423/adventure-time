import React, { createContext, useReducer, useContext } from "react";
import constants from '../utils/constants';

export const UserContext = createContext();

export function userHasRole(user, roles) {
    if (!user) {
        return false;
    }
    if (!('roles' in user)) {
      user.roles = []
    }
    if (typeof roles === 'string') {
        roles = [roles]
    }
    return roles.some(role => user.roles.includes(role));
}

// Initial state
const initialState = {
  isLoggedIn: false,
  user: null,
  error: null
};

// Action creators
export function loginSuccess(user) {
  return { type: constants.LOGIN_SUCCESS, user };
}

export function loginFail(error) {
  return { type: constants.LOGIN_FAIL, error };
}

export function logout() {
  return { type: constants.LOGOUT };
}

// Reducer
export const authReducer = (state, action) => {
  switch (action.type) {
    case constants.LOGIN_SUCCESS:
      return { ...state, isLoggedIn: true, user: action.user, error: null };
    case constants.LOGIN_FAIL:
      return { ...state, isLoggedIn: false, user: null, error: action.error };
    case constants.LOGOUT:
      return { ...state, isLoggedIn: false, user: null, error: null };
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