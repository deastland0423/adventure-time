import React, { Component } from 'react';
import axios from 'axios';
import constants from '../utils/constants';
import AppConfig from '../config';
const { safeGetProp } = require('../utils/data_access');

class BasicFormComponent extends Component {
    /**
     * Component props must include:
     * - entityDef - the entity/model definition
     * - userContext - UserContext value from context consumer
     * - resourceContext - ResourceContext value from context consumer
     * - onComplete - a function called when the form submission is processed successfully
     * - onCancel - a function called when the cancel button is clicked
     */
    constructor(props) {
        super(props);
        this.state = {
            options: {},
            success_message: '',
            error_message: ''
        }
        this.clearData();

        // SECTION: Check entityDef and initialize options where needed
        // in constructor, initialize all options as empty
        this.initializeOptions();
        // send async calls to populate the options values
        this.getOptionsAsync();
    }

    /**
     * Initializes options data structures as blank, runs synchronously during constructor.
     */
    initializeOptions() {
        let initOptions = {};
        for (let i=0; i++; i<this.props.entityDef.fields.length) {
            const field = this.props.entityDef.fields[i];
            if (field.html_input_type === 'select') {
                initOptions[field.id] = [];
            }
        }
        this.setState({options: initOptions});
    }

    /**
     * Gets actual options values via async network call.
     */
    getOptionsAsync() {
        this.props.entityDef.fields.forEach(field => {
            if (field.html_input_type === 'select') {
                const context = {
                    auth: this.props.userContext.auth,
                    resourceContext: this.props.resourceContext
                };
                field.getOptionsAsync(context).then(options => {
                    let stateUpdate = { options: {...this.state.options, [field.id]: options } };
                    if (typeof this.state[field.id] === 'undefined' && options.length) {
                        // if not already set, set current value of drop-down to the first option
                        stateUpdate[field.id] = options[0].id;
                    }
                    this.setState(stateUpdate);
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
    preUpdateState(stateUpdate) {
        this.props.entityDef.fields.forEach(field => {
            if (!stateUpdate[field.id] && field.auto_assign) {
                let contextArg = {};
                contextArg.auth = this.props.userContext.auth;
                contextArg.record = stateUpdate;
                stateUpdate[field.id] = field.auto_assign(contextArg)
            }
        });
        return stateUpdate;
    }

    // Clear the data in the form.
    clearData() {
        let stateUpdate = {
            success_message: '',
            error_message: '',
            isNew: true
        };
        this.props.entityDef.fields.forEach(field => {
            // set each field to default value
            if ('default_value' in field) {
                stateUpdate[field.id] = field.default_value
            } else if (field.html_input_type === 'select' && safeGetProp(this.state, ['options', field.id], []).length ) {
                stateUpdate[field.id] = this.state.options[field.id][0].id;
            } else {
                stateUpdate[field.id] = ''
            }
        });
        stateUpdate = this.preUpdateState(stateUpdate);
        this.setState(stateUpdate);
    }

    // Load data from the given record into the form.
    loadData(record) {
        if (!record) return
        let stateUpdate = {
            success_message: '',
            error_message: '',
            isNew: false
        };
        this.props.entityDef.fields.forEach(field => {
            if (field.html_input_type === "datetime-local") {
                if (record[field.id].slice(-1) === 'Z') {
                    record[field.id] = record[field.id].slice(0, -1)    // remove trailing Z
                }
            }
            if (field.id in record) {
              stateUpdate[field.id] = record[field.id];
            }
        });
        stateUpdate = this.preUpdateState(stateUpdate);
        this.setState(stateUpdate);
    }

    contentFields() {
        let contentFields = [];
        this.props.entityDef.fields.forEach(field => {
            if(field.id !== this.props.entityDef.id_field) {
                contentFields.push(field);
            }
        });
        return contentFields;
    }

    canEditField(field) {
      if ('editAccess' in field && field.editAccess) {
        const req = {
          locals: {
            currentUser: safeGetProp(this.props.userContext, ['auth', 'user'])
          }
        };
        return field.editAccess(req);
      } else {
        // if no editAccess function then assume field is editable
        return true;
      }
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        if (this.state.isNew) {
            const createUrl = `${AppConfig.backend_host}${this.props.entityDef.endpoints.create}`;
            axios
                .post(createUrl, this.state)
                .then( response => {
                    this.setState( { success_message: response.data, error_message: '' } );
                    setTimeout(() => this.setState({success_message:''}), constants.AUTOHIDE_SUCCESS_MESSAGES_SEC*1000);
                    this.props.onComplete();
                })
                .catch( error => {
                    this.setState( { error_message: error.response.data, success_message: '' } );
                })
            ;
        } else {
            const updateUrl = `${AppConfig.backend_host}${this.props.entityDef.endpoints.update}/${this.state[this.props.entityDef.id_field]}`;
            axios
                .put(updateUrl, this.state)
                .then( response => {
                    this.setState( { success_message: response.data, error_message: '' } );
                    setTimeout(() => this.setState({success_message:''}), constants.AUTOHIDE_SUCCESS_MESSAGES_SEC*1000);
                    this.props.onComplete();
                })
                .catch( error => {
                    this.setState( { error_message: error.response.data, success_message: '' } );
                })
            ;
        }
    };


    buttonHandler(handler) {
        return async (event) => {
            event.preventDefault();
            if (typeof handler === "function") {
                handler();
            } else {
                console.log("WARNING: No handler function defined.")
            }
        }
    }


    getFieldKey(field) {
      let key = this.props.entityDef.entity_type+'_form_'+field.id;
      if (field.html_input_type === 'checkbox') {
        key = key+'_'+this.state[field.id];
      }
      return key;
    }

    render() {
        return(
            <form onSubmit={this.handleSubmit}>
                <div className='message error'>{this.state.error_message}</div>
                <div className='message success'>{this.state.success_message}</div>
                {this.contentFields().map(field =>
                        (field.html_input_type && this.canEditField(field) ?
                        <div key={this.getFieldKey(field)}>
                            <label htmlFor={field.id}>{field.label}</label>
                            {field.html_input_type === 'checkbox' ?
                                <input type="checkbox" id={field.id} name={field.id} defaultChecked={this.state[field.id]}
                                    onChange={event => this.setState({ [field.id]: event.target.checked ? true : false })}
                                />
                                  :
                                (field.html_input_type === 'select' ?
                                    <select name={field.id}
                                        value={this.state[field.id]}
                                        onChange={event => this.setState({ [field.id]: event.target.options[event.target.options.selectedIndex].value }) }
                                    >
                                        {safeGetProp(this.state.options, [field.id], []).map(option =>
                                            <option key={`${field.id}_${option.id}`} value={option.id}
                                            >{option.label}</option>
                                        )}
                                    </select>
                                :
                                    <input type={field.html_input_type} name={field.id} defaultValue={this.state[field.id]}
                                        onChange={event => this.setState({ [field.id]: event.target.value })}
                                    />
                                )
                            }
                            <br/>
                        </div>
                        : null)
                )}
                <input type="submit" value={`${this.state.isNew ? 'Create' : 'Save'} ${this.props.entityDef.label}`} data-test="submit" />
                {this.props.onCancel ?
                  <button onClick={this.buttonHandler(this.props.onCancel)}>Cancel</button>
                  : null
                }
            </form>
        );
    }
}


export default BasicFormComponent;
