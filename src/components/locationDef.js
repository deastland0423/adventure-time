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
        deleteOne: '/location'
    }
};
export default locationDef;
