const { safeGetProp } = require('../utils/data_access');

const userDef = {
    entity_type: 'user',
    label: 'User',
    id_field: 'user_id',
    label_field: 'username',
    fields: [
        {
            id: 'user_id',
            label: 'ID',
            table_display: true
        },
        {
            id: 'email_address',
            label: 'Email',
            html_input_type: 'email',
            table_display: true
        },
        {
            id: 'password',
            label: 'Password',
            html_input_type: 'password',
            table_display: false
        },
        {
            id: 'username',
            label: 'Username',
            html_input_type: 'text',
            table_display: true
        },
        {
            id: 'is_player',
            label: 'Player',
            html_input_type: 'checkbox',
            editAccess: (req) => safeGetProp(req, ['locals', 'currentUser', 'roles'], []).includes('ADMIN'),   // Only admin can edit roles
            auto_assign: (context) => (safeGetProp(context, ['record', 'roles']) || []).includes('PLAYER'),
            table_display: false
        },
        {
            id: 'is_dm',
            label: 'DM',
            html_input_type: 'checkbox',
            editAccess: (req) => safeGetProp(req, ['locals', 'currentUser', 'roles'], []).includes('ADMIN'),   // Only admin can edit roles
            auto_assign: (context) => (safeGetProp(context, ['record', 'roles']) || []).includes('DM'),
            table_display: false
        },
        {
            id: 'is_admin',
            label: 'Admin',
            html_input_type: 'checkbox',
            editAccess: (req) => safeGetProp(req, ['locals', 'currentUser', 'roles'], []).includes('ADMIN'),   // Only admin can edit roles
            auto_assign: (context) => (safeGetProp(context, ['record', 'roles']) || []).includes('ADMIN'),
            table_display: false
        },
        {
          id: 'roles',
          label: 'Roles',
          table_display: true
        }
    ],
    endpoints: {
        update: '/user',
        deleteOne: '/user',
        getMultipleByQuery: '/users',
        create: '/users'
    }
};
export default userDef;
