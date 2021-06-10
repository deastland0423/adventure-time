import React, { useEffect, useState } from 'react';
import axios from 'axios';
import constants from '../utils/constants';
import AppConfig from '../config';
import { useUserContext } from "../contexts/UserContext";
import { useResourceContext } from "../contexts/ResourceContext";
const { safeGetProp } = require('../utils/data_access');

const BasicFormComponent = ({
  resourceDef,  // the resource/model definition, required.
  formData,     // data values to populate the form, optional.
  onComplete,   // a function called when the form submission is processed successfully, optional.
  onCancel      // a function called when the cancel button is clicked, optional.
}) => {
  const { auth } = useUserContext();
  const { resource } = useResourceContext();
  const [ options, setOptions ] = useState({});
  const [ messageText, setMessageText ] = useState('');
  const [ messageType, setMessageType ] = useState('');
  const [ record, setRecord ] = useState({});
  const [ isNew, setIsNew ] = useState(null);

  useEffect(() => {
    if(formData) {
      loadData(formData);
    } else {
      clearData();
    }
  }, [formData]);

  useEffect(() => {
    // synchronously, initialize all options as empty
    syncInitializeOptions();
    // send async calls to populate the options values from DB query
    asyncPopulateOptions();
  }, [resourceDef]);

  /**
   * Initializes options data structures as blank, runs synchronously during constructor.
   */
  function syncInitializeOptions() {
    let initOptions = {};
    for (let i=0; i++; i<resourceDef.fields.length) {
      const field = resourceDef.fields[i];
      if (field.html_input_type === 'select') {
        initOptions[field.id] = [];
      }
    }
    setOptions(initOptions);
  }

  /**
   * Gets actual options values via async network call.
   */
  function asyncPopulateOptions() {
    resourceDef.fields.forEach(field => {
      if (field.html_input_type === 'select') {
        const context = {
          auth,
          resource
        };
        field.getOptionsAsync(context).then(asyncOptions => {
          if (typeof record[field.id] === 'undefined' && asyncOptions.length) {
            // if not already set, set current value of drop-down to the first option
            setRecord(prevRecord => {
              return {...prevRecord, [field.id]: asyncOptions[0].id}
            });
          }
          setOptions(prevOpt => {
            return { ...prevOpt, [field.id]: asyncOptions }
          });
        })
        .catch(err => {
          console.log(`Error getting options for ${field.id}: ${err}`);
        });
      }
    });
  }

  /**
   * Runs before setState() to update calculated or auto-assigned fields
   */
  function preUpdateState(recordData) {
    resourceDef.fields.forEach(field => {
      if (!recordData[field.id] && field.auto_assign) {
        let contextArg = {};
        contextArg.auth = auth;
        contextArg.record = recordData;
        recordData[field.id] = field.auto_assign(contextArg)
      }
    });
    return recordData;
  }

  // Clear the data in the form.
  function clearData() {
    setMessageText('');
    setIsNew(true);
    let recordData = {};
    resourceDef.fields.forEach(field => {
      // set each field to default value
      if ('default_value' in field) {
        recordData[field.id] = field.default_value
      } else if (field.html_input_type === 'select' && safeGetProp(options, [field.id], []).length ) {
        recordData[field.id] = options[field.id][0].id;
      } else {
        recordData[field.id] = '';
      }
    });
    recordData = preUpdateState(recordData);
    setRecord(recordData);
  }

  // Load data from the given record into the form.
  function loadData(record) {
    setMessageText('');
    setIsNew(false);
    let recordData = {};
    resourceDef.fields.forEach(field => {
      if (field.html_input_type === "datetime-local") {
        if (record[field.id].slice(-1) === 'Z') {
          record[field.id] = record[field.id].slice(0, -1)    // remove trailing Z
        }
      }
      if (Object.keys(record).includes(field.id)) {
        recordData[field.id] = record[field.id];
      }
    });
    recordData = preUpdateState(recordData);
    setRecord(recordData);
  }

  function contentFields() {
    let contentFields = [];
    resourceDef.fields.forEach(field => {
      if(field.id !== resourceDef.id_field) {
        contentFields.push(field);
      }
    });
    return contentFields;
  }

  function canEditField(field) {
    if ('editAccess' in field && field.editAccess) {
      const req = {
        locals: {
          currentUser: safeGetProp(auth, ['user'])
        }
      };
      return field.editAccess(req);
    } else {
      // if no editAccess function then assume field is editable
      return true;
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isNew) {
      const createUrl = `${AppConfig.backend_host}${resourceDef.endpoints.create}`;
      axios
      .post(createUrl, record)
      .then( response => {
        setMessageText(response.data);
        setMessageType('success');
        setTimeout(() => setMessageText(''), constants.AUTOHIDE_SUCCESS_MESSAGES_SEC*1000);
        if(onComplete)
          onComplete();
      })
      .catch( error => {
        setMessageText(error.response.data);
        setMessageType('error');
      });
    } else {
      const updateUrl = `${AppConfig.backend_host}${resourceDef.endpoints.update}/${record[resourceDef.id_field]}`;
      axios
      .put(updateUrl, record)
      .then( response => {
        setMessageText(response.data);
        setMessageType('success');
        setTimeout(() => setMessageText(''), constants.AUTOHIDE_SUCCESS_MESSAGES_SEC*1000);
        if(onComplete)
          onComplete();
      })
      .catch( error => {
        console.log("caught error",error);
        setMessageText(error.response.data);
        setMessageType('error');
      });
    }
  };

  function getFieldKey(field) {
    let key = resourceDef.resource_type+'_form_'+field.id;
    if (field.html_input_type === 'checkbox') {
      key = key+'_'+record[field.id];
    }
    return key;
  }

  return(
    <form onSubmit={(e)=>e.preventDefault()} className={`${resourceDef.resource_type}-form`}>
      <div className={`message ${messageType}`}>{messageText}</div>
      {contentFields().map(field =>
        (field.html_input_type && canEditField(field) ?
          <div key={getFieldKey(field)}>
            <label htmlFor={field.id}>{field.label}</label>
            {field.html_input_type === 'checkbox' ?
              <input type="checkbox" id={field.id} name={field.id} defaultChecked={record[field.id]}
                onChange={event => setRecord({ ...record, [field.id]: event.target.checked ? true : false })}
                className={`${field.id}-field`}
              />
            :
              (field.html_input_type === 'select' ?
                <select name={field.id}
                  value={record[field.id]}
                  onChange={event => setRecord({ ...record, [field.id]: event.target.options[event.target.options.selectedIndex].value }) }
                  className={`${field.id}-field`}
                >
                  {safeGetProp(options, [field.id], []).map(option =>
                      <option key={`${field.id}_${option.id}`} value={option.id}
                      >{option.label}</option>
                  )}
                </select>
              :
                <input type={field.html_input_type} name={field.id} defaultValue={record[field.id]}
                  onChange={event => setRecord({...record, [field.id]: event.target.value })}
                  className={`${field.id}-field`}
                />
              )
            }
            <br/>
          </div>
        : null)
      )}
      <input type="submit"
        value={`${isNew ? 'Create' : 'Save'} ${resourceDef.label}`}
        onClick={handleSubmit}
      />
      {onCancel ?
        <button onClick={onCancel}>Cancel</button>
      : null}
    </form>
  );
}

export default BasicFormComponent;
