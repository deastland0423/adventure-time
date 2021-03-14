const adventureDef = {
    entity_type: 'adventure',
    label: 'Adventure',
    id_field: 'adventure_id',
    label_field: 'name',
    fields: [
        {
            id: 'adventure_id',
            label: 'ID',
            table_display: false
        },
        {
            id: 'name',
            label: 'Name',
            html_input_type: 'text',
            table_display: true
        },
        {
            id: 'session_id',
            label: 'Session',
            html_input_type: 'select',
            table_display: false,
            getOptionsQueryDef: (userContext) => {
                let queryParams = {};
                //TODO(authorization): if user is NOT admin, load only available sessions : get /sessions/available WHERE reserved = 0
                //if (!userContext.hasRole('ADMIN')) {
                //queryParams = {reserved: false}
                //}
                return {
                    entity_type: 'session',
                    endpoint: 'getMultipleByQuery',
                    queryParams: queryParams
                }
            }
        },
        {
            id: 'location_id',
            label: 'Location',
            html_input_type: 'number',
            table_display: false
        },
        {
            id: 'character_count',
            label: 'Number of Characters',
            html_input_type: 'number',
            table_display: true
        },
        {
            id: 'start_time',
            label: 'Adventure Start Time',
            table_display: 'start_time'
        },
        {
            id: 'location_name',
            label: 'Location',
            table_display: 'location_name'
        }
    ],
    endpoints: {
        getMultipleByQuery: '/adventures/view',
        create: '/adventures',
        //TODO: figure out how to add /:location_id parameter to pattern, dynamically injected from record context?
        update: '/adventure',
        deleteOne: '/adventure'
    }
};
export default adventureDef;
