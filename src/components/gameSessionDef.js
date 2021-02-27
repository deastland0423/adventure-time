const entityDef = {
    entity_type: 'game_session',
    label: 'Session',
    id_field: 'game_session_id',
    label_field: 'start_timestamp',
    fields: [
        {
            id: 'game_session_id',
            label: 'ID',
            table_display: false
        },
        {
            id: 'creator_dm_user_id',
            label: 'DM',
            html_input_type: false,
            auto_assign: (context) => {
                if (context && 'auth' in context && context.auth && 'user' in context.auth && context.auth.user) {
                    return context.auth.user.user_id
                } else {
                    return null
                }
            },
            entity_reference: {
                entity_type: 'user'
            },
            table_display: true
        },
        {
            id: 'start_timestamp',
            label: 'Session Start Time',
            html_input_type: 'datetime-local',
            table_display: true
        },
        {
            id: 'duration_min',
            label: 'Session Length (min)',
            html_input_type: 'number',
            table_display: true
        }
    ],
    endpoints: {
        getMultipleByQuery: '/game_sessions',
        create: '/game_sessions',
        //TODO: figure out how to add /:location_id parameter to pattern, dynamically injected from record context?
        update: '/game_session',
        deleteOne: '/game_session'
    }
};
export default entityDef;
