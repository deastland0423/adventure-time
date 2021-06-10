import { useState } from 'react';
//import axios from 'axios';
//import constants from '../utils/constants';
//import AppConfig from '../config';
import possessionDef from "../models/possessionDef";
import { useModalContext, showModal, hideModal } from "../contexts/ModalContext";
import { useUserContext, userHasRole } from '../contexts/UserContext';
import ResourceBase from '../components/ResourceBase';

const ManageCharacter = ({context}) => {
  const { dispatch: dispatchModal } = useModalContext();
  const { auth } = useUserContext();
  const [ messageText, setMessageText ] = useState('');
  const [ messageType, setMessageType ] = useState('');
  
/*
  const handleSubmit = async (event) => {
    // Validate the data!
    if (!locationName.match(/(.|\s)*\S(.|\s)*             /)) {
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
*/
  function manageCharacter(row) {
    console.log("managing char for ",row)
    dispatchModal(showModal(
      <div>
        <h1>{row.name}</h1>
        <h2>{row.class} level {row.level}</h2>
        <ResourceBase resourceDef={possessionDef} includeOps={true} queryParams={{character_id: row.character_id}} />
      </div>
    ));
  }
  return (
    userHasRole(auth?.user, ['ADMIN']) && !context.row.location_id ?
      <button onClick={() => manageCharacter(context.row)}>manage</button>
    : null
  );
};

export default ManageCharacter;
