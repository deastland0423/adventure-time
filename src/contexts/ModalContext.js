import React, { createContext, useReducer, useContext } from "react";
import constants from '../utils/constants';

export const ModalContext = createContext();

// Initial state
const initialState = {
  hidden: true,
  content: null
};

// Action creators
export function showModal(content) {
  return { type: constants.SHOW_MODAL, content };
}

export function hideModal() {
  return { type: constants.HIDE_MODAL };
}

// Reducer
export const modalReducer = (state, action) => {
  switch (action.type) {
    case constants.SHOW_MODAL:
      console.log("showModal running with content=",action.content)
      return { ...state, hidden: false, content: action.content };
    case constants.HIDE_MODAL:
      return { ...state, hidden: true, content: null };
    default:
      return state;
  }
}

function ModalProvider(props) {
  const [modal, dispatch] = useReducer(modalReducer, initialState);
  const modalData = { modal, dispatch };
  return <ModalContext.Provider value={modalData} {...props} />;
}

function useModalContext() {
  return useContext(ModalContext);
}

export { ModalProvider, useModalContext };
