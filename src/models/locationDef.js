const locationDef = {
    entity_type: 'location',
    label: 'Location',
    id_field: 'location_id',
    label_field: 'name',
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
        },
        {
            id: 'is_empty',
            label: 'Nothing to see here',
            html_input_type: 'checkbox',
            table_display: true
        },
        {
            id: 'map_id',
            label: 'Map ID',
            default_value: 1,
            html_input_type: 'number',
            table_display: false
        },
        {
            id: 'hex',
            label: 'Hex',
            default_value: '0101',
            html_input_type: 'text',
            table_display: true
        },
        {
            id: 'sub_hex',
            label: 'Sub-hex',
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
