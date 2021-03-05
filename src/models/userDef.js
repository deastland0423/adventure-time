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
