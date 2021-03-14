import React, { createContext, useReducer, useContext } from "react";
import constants from '../utils/constants';
import EntityHandler from '../utils/EntityHandler';

export const ResourceContext = createContext();

// Initial state
const initialState = {
  defs: {},
  endpoints: {},
  handlers: {}
};

// Action creators
export function registerDef(entityDef) {
  return { type: constants.REGISTER_DEF, entityDef };
}

// Reducer
export const resourceReducer = (state, action) => {
  switch (action.type) {
    case constants.REGISTER_DEF:
      let newDefs = state.defs;
      let newEndpoints = state.endpoints;
      let newHandlers = state.handlers;
      newDefs[action.entityDef.entity_type] = action.entityDef;
      newEndpoints[action.entityDef.entity_type] = action.entityDef.endpoints
      //TODO: convert endpoints to handlers to invoke the API endpoint
      newHandlers[action.entityDef.entity_type] = new EntityHandler(action.entityDef);
      return { ...state, defs: newDefs, endpoints: newEndpoints, handlers: newHandlers };
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
