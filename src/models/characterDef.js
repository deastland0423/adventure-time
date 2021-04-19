const { safeGetProp } = require('../utils/data_access');

const characterDef = {
  resource_type: 'character',
  label: 'Character',
  id_field: 'character_id',
  label_field: 'name',
  fields: [
    {
      id: 'character_id',
      label: 'ID',
      table_display: true
    },
    {
      id: 'name',
      label: 'Name',
      html_input_type: 'text',
      table_display: true
    },
    {
      id: 'username',
      label: 'User Name',
      table_display: 'username'
    },
    {
      id: 'class',
      label: 'Class',
      html_input_type: 'text',
      table_display: true
    },
    {
      id: 'level',
      label: 'Level',
      html_input_type: 'number',
      table_display: true
    },
    {
      id: 'gold',
      label: 'Gold',
      html_input_type: 'number',
      table_display: true
    },
    {
      id: 'home_base_settlement_id',
      label: 'Home Base',
      html_input_type: 'number',
      table_display: true
    },
    {
      id: 'owner_user_id',
      label: 'User',
      auto_assign: (context) => safeGetProp(context, ['auth', 'user', 'user_id']),
      table_display: false
    }
  ],
  endpoints: {
    getMultipleByQuery: '/characters/view',
    create: '/characters',
    //TODO: figure out how to add /:location_id parameter to pattern, dynamically injected from record context?
    update: '/character',
    deleteOne: '/character'
  }
};
export default characterDef;
