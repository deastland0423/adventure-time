const hexDef = {
  entity_type: 'hex',
  label: 'Hex',
  id_field: 'hex_id',
  plural: 'hexes',
  label_field: 'coords',
  fields: [
    {
      id: 'hex_id',
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
        id: 'coords',
        label: 'Coordinates',
        html_input_type: 'text',
        table_display: true
    },
    {
      id: 'is_explored',
      label: 'Explored?',
      html_input_type: 'checkbox',
      table_display: true
    },
    {
      id: 'is_polite',
      label: 'Polite?',
      html_input_type: 'checkbox',
      table_display: true
    },
    {
      id: 'terrain_type',
      label: 'Terrain',
      html_input_type: 'select',
      table_display: true,
      getOptionsAsync: async (context) => {
        return Promise.resolve([
          {id:'LIGHT_FOREST', label:'Light Forest'},
          {id:'DENSE_FOREST',label:'Dense forest'},
          {id:'GRASSLAND',label:'Grassland'},
          {id:'MOUNTAIN',label:'Mountain'},
          {id:'SWAMP',label:'Swamp'}
        ]);
      }
    },
    {
      id: 'map_id',
      label: 'Map ID',
      default_value: 1,
      html_input_type: 'number',
      table_display: false
      }
  ],
  endpoints: {
    getMultipleByQuery: '/hexes',
    create: '/hexes',
    update: '/hex',
    deleteOne: '/hex'
  }
};
export default hexDef;
