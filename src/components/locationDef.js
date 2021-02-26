const locationDef = {
    label: 'Location',
    id_field: 'location_id',
    fields: [
        {
            id: 'location_id',
            label: 'ID',
            table_display: true
        },
        {
            id: 'name',
            label: 'Name',
            html_input_type: 'text',
            table_display: true
        }
    ],
    endpoints: {
        getMultipleByQuery: '/locations',
        create: '/locations',
        //TODO: figure out how to add /:location_id parameter to pattern, dynamically injected from record context?
        update: '/location',
        deleteOne: '/location'
    }
};
export default locationDef;
