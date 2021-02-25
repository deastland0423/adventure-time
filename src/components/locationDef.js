const locationDef = {
    label: 'Location',
    id_field: 'location_id',
    fields: [
        {
            id: 'location_id',
            label: 'ID'
        },
        {
            id: 'name',
            label: 'Name',
            html_input_type: 'text'
        }
    ],
    endpoints: {
        getMultipleByQuery: '/locations',
        create: '/locations'
    }
};
export default locationDef;
