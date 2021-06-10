const possessionDef = {
  resource_type: 'possession',
  label: 'Possession',
  id_field: 'possession_id',
  plural: 'possessions',
  label_field: 'name',
  fields: [
    {
      id: 'possession_id',
      label: 'ID',
      table_display: true
    },
    {
      id: 'character_id',
      label: 'Owner (char)',
      html_input_type: true,
      table_display: true
    },
    {
      id: 'name',
      label: 'Name',
      html_input_type: 'text',
      table_display: true
    },
    {
      id: 'value',
      label: 'Value',
      html_input_type: 'number',
      table_display: true
    },
    {
      id: 'in_inventory',
      label: 'Inventory?',
      html_input_type: 'checkbox',
      table_display: true
    },
    {
      id: 'player_description',
      label: 'Description',
      html_input_type: 'text',
      table_display: true
    }
  ],
  endpoints: {
    getMultipleByQuery: '/possessions',
    create: '/possessions',
    update: '/possession',
    deleteOne: '/possession'
  }
};
export default possessionDef;
