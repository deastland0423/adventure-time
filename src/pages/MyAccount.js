import { useEffect, useState } from 'react';
import axios from 'axios';
import constants from '../utils/constants';
import AppConfig from '../config';
import { useUserContext, loginSuccess } from "../contexts/UserContext";
import BasicForm from '../components/BasicForm';
import userDef from '../models/userDef';
import loading from '../images/loading.gif';
const { safeGetProp } = require('../utils/data_access');

const MyAccount = () => {
  const { auth, dispatch: dispatchUser } = useUserContext();
  const [ user, setUser ] = useState(null);
  // Preference management
  const [ messageText, setMessageText ] = useState('');
  const [ messageType, setMessageType ] = useState('');
  const [ savingPrefs, setSavingPrefs ] = useState(false);
  // Specific settings stored as user prefs
  const [ showHexCoords, setShowHexCoords ] = useState(false);

  useEffect(() => {
    setUser(auth.user);
    setShowHexCoords(safeGetProp(auth, ['user', 'prefs', 'show_hex_coords'], false));
  }, [auth]);

  const savePrefs = async (event) => {
    event.preventDefault();
    setSavingPrefs(true);
    const userPrefsData = {
      user_id: user.user_id,
      prefs: {
        show_hex_coords: showHexCoords
      }
    };
    const updateUrl = `${AppConfig.backend_host}${userDef.endpoints.update}/${userPrefsData.user_id}`;
    axios
    .put(updateUrl, userPrefsData)
    .then( response => {
      setMessageText(response.data);
      setMessageType('success');
      setTimeout(() => setMessageText(''), constants.AUTOHIDE_SUCCESS_MESSAGES_SEC*1000);
      auth.user.prefs = userPrefsData.prefs;
      dispatchUser(loginSuccess(auth.user));
    })
    .catch( error => {
      console.log("caught error",error);
      setMessageText(error.response.data);
      setMessageType('error');
    })
    .finally(() => {
      setSavingPrefs(false);
    });
  };

  return(
    <div id="my-account" className="outer">
      <h1>My Account</h1>
      <div className="inner">
        {auth.user ?
          <div>
            <BasicForm
              resourceDef={userDef}
              formData={user}
            />
            <form onSubmit={(e) => e.preventDefault()}>
              <h2>Preferences</h2>
              <div className={`message ${messageType}`}>{messageText}</div>

              <label htmlFor="show_hex_coords">Show coordinates on the hex map</label>
              <input type="checkbox" id="show_hex_coords" name="show_hex_coords" checked={showHexCoords}
                onChange={event => setShowHexCoords(event.target.checked)}
              />
              <br/>
              <input type="submit"
                value="Save Preferences"
                onClick={savePrefs}
              />
              {savingPrefs ?
                <div className="loading">
                  <img src={loading} alt="saving..."/>
                    Saving...
                </div>
              : null}

            </form>
          </div>
        :
          <strong>You must be logged in to access this page.</strong>
        }
      </div>
    </div>
  );
};

export default MyAccount;
