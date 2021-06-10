import { useEffect, useState } from 'react';
import axios from 'axios';
import AppConfig from '../config';
import { useModalContext, hideModal } from "../contexts/ModalContext";
import { useResourceContext } from "../contexts/ResourceContext";
import constants from '../utils/constants';
import adventureDef from "../models/adventureDef";

const CallToAdventure = ({
  sessionOptions,
  ctaHex
}) => {
  const { dispatch: dispatchModal } = useModalContext();
  const { resource } = useResourceContext();
  const [messageText, setMessageText] = useState('');
  const [messageType, setMessageType] = useState('');
  const [ctaName, setCtaName] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [showLocation, setShowLocation] = useState(null);
  const [locationId, setLocationId] = useState('');
  const [locationOptions, setLocationOptions] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Validate the data!
    const errors = [];
    if (!ctaName.match(/(.|\s)*\S(.|\s)*/))
      errors.push("name must not be blank");
    if (sessionId == 0)
      errors.push("gotta pick a session");
    if (errors.length) {
      setMessageType('error');
      setMessageText('Ya done fucked up: '.concat(errors.join(' AND ')));
      return;
    }
    // Proceed with API call to save.
    const createUrl = `${AppConfig.backend_host}${adventureDef.endpoints.create}`;
    const adventureData = {
      name: ctaName,
      session_id: sessionId,
      location_id: locationId,
      character_count: 6 //TODO: get this from somewhere?
    };
    axios
    .post(createUrl, adventureData)
    .then( response => {
      setMessageText(response.data);
      setMessageType('success');
      setTimeout(() => setMessageText(''), constants.AUTOHIDE_SUCCESS_MESSAGES_SEC*1000);
      alert("Call to Adventure was successfully created!");
      dispatchModal(hideModal());
    })
    .catch( error => {
      setMessageText(error.response.data);
      setMessageType('error');
    });
  };


  useEffect(() => {
    if(ctaHex.is_explored) {
      // EXPLORED HEX: show available adventure locations in this hex
      setCtaName(`Call to adventure`);
      resource.handlers['location'].callApi('getMultipleByQuery', {map_id: constants.MAP_ID, hex_id: ctaHex.hex_id})
      .then(response => {
        if(response.data.length === 0) {
          // no locations available in this hex
        } else {
          const locationOptions = response.data.map(row => {
            return {
              id: row.location_id,
              label: row.name
            };
          });
          setShowLocation(true);
          setLocationOptions(locationOptions);
        }
      })
      .catch(err => {
        console.log("Error retrieving locations for hex:",err);
        alert("Magic scrying orb is not working.");
      });
    } else {
      // EXPLORATION CTA: set location to this hex and hide input from form
      const terrainLabel = constants.TERRAIN_TYPES[ctaHex.terrain_type];
      setCtaName(`Explore the ${terrainLabel}`);
      setShowLocation(false);
      resource.handlers['location'].callApi('getMultipleByQuery', {map_id: constants.MAP_ID, hex_id: ctaHex.hex_id, sub_hex: null})
      .then(response => {
        if(response.data.length === 0) {
          console.log(`Could not find location record for hex at ${ctaHex.coords}`);
          alert("The data wizards have been recalcitrant in their duties. This area cannot be explored right now.");
        } else {
          setLocationId(response.data[0].location_id);
        }
      })
      .catch(err => {
        console.log("Error retrieving main location for hex:",err);
        alert("The pipes are broken.");
      });
    }
  }, [ctaHex]);


  return (
    <div>
      {!ctaHex.is_explored ?
        <em>This land is unexplored.<br/></em>
      : null}
      <form onSubmit={(e)=>e.preventDefault()} className="adventure-form">
        <div className={`message ${messageType}`}>{messageText}</div>
        <div>
          <label htmlFor="name">Name</label>
          <input type="text" name="name" id="name" value={ctaName}
            onChange={event => setCtaName(event.target.value)}
            className="name-field"
          />
        </div>

        <div>
          <label htmlFor="session_id">Session</label>
          <select name="session_id" id="session_id"
            value={sessionId}
            onChange={event => setSessionId(event.target.options[event.target.options.selectedIndex].value)}
            className="session_id-field"
          >
            <option value={''}>-- Select Session --</option>
            {sessionOptions.map(option =>
                <option key={`session_id_${option.id}`} value={option.id}
                >{option.label}</option>
            )}
          </select>
        </div>

        {showLocation ?
          <div>
            <label htmlFor="location_id">Location</label>
            <select name="location_id"
              value={locationId}
              onChange={event => setLocationId(event.target.options[event.target.options.selectedIndex].value)}
              className="location_id-field"
            >
              <option value={''}>-- Select Location --</option>
              {locationOptions.map(option =>
                  <option key={`location_id_${option.id}`} value={option.id}
                  >{option.label}</option>
              )}
            </select>
          </div>
        : null}

        <div>
          <input type="submit"
            value="Create Call to Adventure"
            onClick={handleSubmit}
          />
          <button onClick={() => dispatchModal(hideModal())}>Cancel</button>
        </div>
      </form>
    </div>
  )
};

export default CallToAdventure;
