import constants from '../utils/constants';
import CreateLocation from '../components/admin/CreateLocation';

const hexDef = {
  resource_type: 'hex',
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
        let options = [];
        for (const [key, label] of Object.entries(constants.TERRAIN_TYPES)) {
          options.push({id: key, label: label});
        }
        return Promise.resolve(options);
      }
    },
    {
      id: 'map_id',
      label: 'Map ID',
      default_value: 1,
      html_input_type: 'number',
      table_display: false
    },
    {
      id: 'location_id',
      label: 'Main Location',
      html_input_type: false,
      table_display: true
    }
  ],
  extra_operations: (context) => {
    return (
      <CreateLocation context={context}/>
    );
  },
  endpoints: {
    getMultipleByQuery: '/hexes/view',
    create: '/hexes',
    update: '/hex',
    deleteOne: '/hex'
  }
};
export default hexDef;
