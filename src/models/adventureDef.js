import { userHasRole } from '../contexts/UserContext';
const { safeGetProp } = require('../utils/data_access');

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
            getOptionsAsync: async (context) => {
                let queryParams = {};
                // if user is NOT admin, load only available sessions : get /sessions/available WHERE reserved = 0
                if (!userHasRole(safeGetProp(context, ['auth', 'user']), ['ADMIN'])) {
                    queryParams = {reserved: 0};
                }
                const entityResourceHandler = context.resourceContext.resource.handlers['session'];
                // return promise of options array
                return entityResourceHandler.callApi('getMultipleByQuery', queryParams)
                    .then(response => {
                        const options = response.data.map(row => {
                            return {
                                id: row.session_id,
                                label: entityResourceHandler.getLabel(row)
                            };
                        });
                        return options;
                    })
                ;
            },
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
