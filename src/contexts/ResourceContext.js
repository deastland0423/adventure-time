import React, { createContext, useReducer, useContext } from "react";
import constants from '../utils/constants';
import ResourceHandler from '../utils/ResourceHandler';

export const ResourceContext = createContext();

// Initial state
const initialState = {
  defs: {},
  handlers: {}
};

// Action creators
export function registerDef(resourceDef) {
  return { type: constants.REGISTER_DEF, resourceDef };
}

// Reducer
export const resourceReducer = (state, action) => {
  switch (action.type) {
    case constants.REGISTER_DEF:
      let newDefs = state.defs;
      let newHandlers = state.handlers;
      newDefs[action.resourceDef.resource_type] = action.resourceDef;
      newHandlers[action.resourceDef.resource_type] = new ResourceHandler(action.resourceDef);
      return { ...state, defs: newDefs, handlers: newHandlers };
    default:
      return state;
  }
}

function ResourceProvider(props) {
  const [resource, dispatch] = useReducer(resourceReducer, initialState);
  const resourceData = { resource, dispatch };
  return <ResourceContext.Provider value={resourceData} {...props} />;
}

function useResourceContext() {
  return useContext(ResourceContext);
}

export { ResourceProvider, useResourceContext };
