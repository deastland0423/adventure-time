const roleDef = {
    label: 'Player Role Type',
    id_field: 'role_id',
    fields: [
        {
            id: 'role_id',
            label: 'Role ID',
            table_display: true
        },
        {
            id: 'role_name',
            label: 'Role Type',
            html_input_type: 'text',
            table_display: true
        }
    ],
    endpoints: {
        getMultipleByQuery: '/roles',
        create: '/roles'
    }
};
export default roleDef;
