const { safeGetProp } = require('../utils/data_access');

const entityDef = {
    entity_type: 'session',
    label: 'Session',
    id_field: 'session_id',
    label_field: 'start_timestamp',
    fields: [
        {
            id: 'session_id',
            label: 'ID',
            table_display: false
        },
        {
            id: 'host_user_id',
            label: 'DM/Host',
            html_input_type: 'number',  //TODO:change this to a drop-down based on reference to user table
            auto_assign: (context) => safeGetProp(context, ['auth', 'user', 'user_id']),
            table_display: 'username'
        },
        {
            id: 'start_time',
            label: 'Session Start Time',
            html_input_type: 'datetime-local',
            table_display: true
        },
        {
            id: 'duration',
            label: 'Session Length (min)',
            html_input_type: 'number',
            table_display: true
        },
        {
            id: 'max_characters',
            label: 'Max Characters',
            html_input_type: 'number',
            table_display: true
        },
        {
            id: 'reserved',
            label: 'Reserved',
            html_input_type: 'checkbox',
            table_display: true
        }
    ],
    endpoints: {
        getMultipleByQuery: '/sessions/view',
        create: '/sessions',
        //TODO: figure out how to add /:location_id parameter to pattern, dynamically injected from record context?
        update: '/session',
        deleteOne: '/session'
    }
};
export default entityDef;
