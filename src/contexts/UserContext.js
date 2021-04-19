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

export function curUserCan(auth, reqMethod, reqUrl) {
  const { safeGetProp } = require('../utils/data_access');  // required by access check rules from BE
  let result;
  Object.entries(auth.accessRules).every(([endpointSig, accessCheck]) => {
    const [method, url] = endpointSig.split(' ');
    let matches = [];
    //console.log(`checking reqUrl ${reqUrl} against endpoint url ${url}`)
    if (reqMethod === method && (matches = reqUrl.match(new RegExp('^'+url)))) {
      const req = {
        locals: {
          routeParams: matches.slice(1),
          currentUser: auth.user,
          safeGetProp: safeGetProp
        }
      }
      //console.log(`AUTH DEBUG: found match, accessCheckFn: `,accessCheck)
      const accessResult = accessCheck(req);
      //console.log(`AUTH DEBUG: accessCheck result: `,accessResult)
      result = accessResult;
      return false; // break out of .every() loop
    }
    return true; //no match found yet, keep checking
  });
  if (typeof result !== 'undefined') {
    //console.log(`AUTH DEBUG: returning accessCheck result: `,result)
    return result;
  } else {
    // No route match, assume unrestricted.
    console.log(`DEBUG: No route match for ${reqMethod} ${reqUrl}`);
    return true;
  }
}

// Initial state
const initialState = {
  accessRules: {},
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

export function setAccessRules(accessRules) {
  return { type: constants.SET_ACCESS_RULES, accessRules };
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
    case constants.SET_ACCESS_RULES:
      return { ...state, accessRules: action.accessRules };
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
