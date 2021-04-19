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
            id: 'map_id',
            label: 'Map ID',
            default_value: 1,
            html_input_type: 'number',
            table_display: false
        },
        {
            id: 'hex_id',
            label: 'Hex',
            html_input_type: 'select',
            table_display: false,
            getOptionsAsync: async (context) => {
                const entityResourceHandler = context.resourceContext.resource.handlers['hex'];
                // return promise of options array
                return entityResourceHandler.callApi('getMultipleByQuery')
                    .then(response => {
                        const options = response.data.map(row => {
                            return {
                                id: row.hex_id,
                                label: entityResourceHandler.getLabel(row)
                            };
                        });
                        return options;
                    })
                ;
            },
        },
        {
            id: 'hex_name',
            label: 'Hex Name',
            html_input_type: false,
            table_display: true
        },
        {
            id: 'hex_coords',
            label: 'Hex Coords',
            html_input_type: false,
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
        getMultipleByQuery: '/locations/view',
        create: '/locations',
        //TODO: figure out how to add /:location_id parameter to pattern, dynamically injected from record context?
        update: '/location',
        deleteOne: '/location'
    }
};
export default locationDef;
