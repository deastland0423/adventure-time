import React, { Component } from 'react';
import axios from 'axios';
import AppConfig from '../config';
import { UserContext } from "../contexts/UserContext";
const { safeGetProp } = require('../utils/data_access');

class BasicFormComponent extends Component {
    static contextType = UserContext;
    /**
     * Must specify entityDef in props
     */
    constructor(props) {
        super(props);
        this.state = {
            success_message: '',
            error_message: ''
        }
        this.clearData();
    }

    /**
     * Runs before setState() to update calculated or auto-assigned fields
     */
    preUpdateState(stateUpdate) {
        this.props.entityDef.fields.forEach(field => {
            if (!stateUpdate[field.id] && field.auto_assign) {
                let contextArg = {};
                contextArg.auth = safeGetProp(this, ['context', 'auth']);
                contextArg.record = stateUpdate;
                stateUpdate[field.id] = field.auto_assign(contextArg)
            }
        });
        return stateUpdate;
    }

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
            } else {
                stateUpdate[field.id] = ''
            }
        });
        stateUpdate = this.preUpdateState(stateUpdate);
        this.setState(stateUpdate);
    }

    loadData(record) {
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
            stateUpdate[field.id] = record[field.id];
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

    handleSubmit = async (event) => {
        event.preventDefault();
        if (this.state.isNew) {
            const createUrl = `${AppConfig.backend_host}${this.props.entityDef.endpoints.create}`;
            axios
                .post(createUrl, this.state)
                .then( response => {
                    this.setState( { success_message: response.data, error_message: '' } );
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
                        (field.html_input_type ?
                        <div key={this.getFieldKey(field)}>
                            <label htmlFor={field.id}>{field.label}</label>
                            {field.html_input_type === 'checkbox' ?
                                <input type="checkbox" id={field.id} name={field.id} defaultChecked={this.state[field.id]}
                                    onChange={event => this.setState({ [field.id]: event.target.checked ? true : false })}
                                />
                                  :
                                <input type={field.html_input_type} name={field.id} defaultValue={this.state[field.id]}
                                    onChange={event => this.setState({ [field.id]: event.target.value })}
                                />
                            }
                            <br/>
                        </div>
                        : null)
                )}
                <input type="submit" value={`${this.state.isNew ? 'Create' : 'Save'} ${this.props.entityDef.label}`} data-test="submit" />
                <button onClick={this.buttonHandler(this.props.onCancel)}>Cancel</button>
            </form>
        );
    }
}

export default BasicFormComponent;
