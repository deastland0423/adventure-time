const constants = {
  TERRAIN_TYPES: {
    LIGHT_FOREST: 'Light forest',
    DENSE_FOREST: 'Dense forest',
    GRASSLAND: 'Grassland',
    MOUNTAIN: 'Mountain',
    SWAMP: 'Swamp'
  },
  AUTOHIDE_SUCCESS_MESSAGES_SEC: 3,
  DEBUG_PERMS: false,
  MAP_ID: 1,
  // ModalContext action types
  SHOW_MODAL: 'SHOW_MODAL',
  HIDE_MODAL: 'HIDE_MODAL',
  // UserContext action types
  SET_ACCESS_RULES: 'SET_ACCESS_RULES',
  REGISTER_DEF: 'REGISTER_DEF',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  LOGIN_FAIL: 'LOGIN_FAIL'
}

export default constants;
