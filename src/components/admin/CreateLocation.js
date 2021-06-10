import { useState } from 'react';
import axios from 'axios';
import constants from '../../utils/constants';
import AppConfig from '../../config';
import locationDef from "../../models/locationDef";
import { useModalContext, showModal, hideModal } from "../../contexts/ModalContext";
import { useUserContext, userHasRole } from '../../contexts/UserContext';
const { safeGetProp } = require('../../utils/data_access');

const CreateLocation = ({context}) => {
  const { dispatch: dispatchModal } = useModalContext();
  const { auth } = useUserContext();
  const [ messageText, setMessageText ] = useState('');
  const [ messageType, setMessageType ] = useState('');
  const [ locationName, setLocationName ] = useState(context.row.name);

  const handleSubmit = async (event) => {
    // Validate the data!
    if (!locationName.match(/(.|\s)*\S(.|\s)*/)) {
      setMessageType('error');
      setMessageText('Location name must not be blank, ya daft wizard!');
      return;
    }
    // Proceed with API call to save.
    const createUrl = `${AppConfig.backend_host}${locationDef.endpoints.create}`;
    const locationData = {
      name: locationName,
      map_id: context.row.map_id,
      hex_id: context.row.hex_id,
      sub_hex: ''
    };
    axios
    .post(createUrl, locationData)
    .then( response => {
      setMessageText(response.data);
      setMessageType('success');
      setTimeout(() => setMessageText(''), constants.AUTOHIDE_SUCCESS_MESSAGES_SEC*1000);
      alert("Location was successfully created!");
      dispatchModal(hideModal());
      context.refreshTableData();
    })
    .catch( error => {
      console.log(error);
      setMessageText(error.response.data);
      setMessageType('error');
    });
  };

  function createLocation(row) {
    dispatchModal(showModal(
      <form onSubmit={(e)=>e.preventDefault()} className="location-form">
        <div className={`message ${messageType}`}>{messageText}</div>
        <label htmlFor="name">Location Name</label>
        <input type="text" name="name" defaultValue={locationName}
          onChange={event => setLocationName(event.target.value)}
          className="name-field"
        />
        <input type="submit"
          value="Create location"
          onClick={handleSubmit}
        />
      </form>
    ));
  }
  return (
    userHasRole(safeGetProp(auth, ['user']), ['ADMIN']) && !context.row.location_id ?
      <button onClick={() => createLocation(context.row)}>Create Main Location</button>
    : null
  );
};

export default CreateLocation;
