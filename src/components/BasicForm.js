import React, { Component } from 'react';
import axios from 'axios';
import AppConfig from '../config';
import { UserContext } from "../contexts/UserContext";

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
            if (field.auto_assign) {
                let contextArg = null;
                if ('context' in this && this.context && 'auth' in this.context && this.context.auth) {
                    contextArg = {
                        auth: this.context.auth
                    }
                }
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
            stateUpdate[field.id] = ''
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
            stateUpdate[field.id] = record[field.id];
        });
        this.preUpdateState(stateUpdate);
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


    render() {
        return(
            <form onSubmit={this.handleSubmit}>
                <div className='message error'>{this.state.error_message}</div>
                <div className='message success'>{this.state.success_message}</div>
                {this.contentFields().map(field =>
                        (field.html_input_type ?
                        <div key={this.props.entityDef.entity_type+'_form_'+field.id}>
                            <label>{field.label}</label>
                            <input type={field.html_input_type} name={field.id} defaultValue={this.state[field.id]}
                              onChange={event => this.setState({ [field.id]: event.target.value })}
                            /><br/>
                        </div>
                        : null)
                )}
                <input type="submit" value={`${this.state.isNew ? 'Create' : 'Edit'} ${this.props.entityDef.label}`} data-test="submit" />
                <button onClick={this.buttonHandler(this.props.onCancel)}>Cancel</button>
            </form>
        );
    }
}

export default BasicFormComponent;
