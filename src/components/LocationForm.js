import React, { Component } from 'react';
import axios from 'axios';
import AppConfig from '../config';
import locationDef from './locationDef';

class LocationFormComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
          success_message: '',
          error_message: ''
        };
        this.contentFields().forEach(field => {
            this.state[field.id] = ''
        });
    }

    contentFields() {
        let contentFields = [];
        locationDef.fields.forEach(field => {
            if(field.id != locationDef.id_field) {
                contentFields.push(field);
            }
        });
        return contentFields;
    }

    handleSubmit = async (event) => {
        event.preventDefault();
          let locationsUrl = `${AppConfig.backend_host}/locations`;
          axios
              .post(locationsUrl, this.state)
              .then( response => {
                this.setState( { success_message: response.data, error_message: '' } );
                this.props.onComplete();
              })
              .catch( error => {
                this.setState( { error_message: error.response.data, success_message: '' } );
              })
    };


    render() {
        return(
            <form onSubmit={this.handleSubmit}>
                <div className='message error'>{this.state.error_message}</div>
                <div className='message success'>{this.state.success_message}</div>
                {this.contentFields().map(field =>
                    <div>
                        <label>{field.label}</label>
                        <input type="{field.html_input_type}" name="{field.id}" defaultValue={this.state[field.id]}
                          onChange={event => this.setState({ [field.id]: event.target.value })}
                        /><br/>
                    </div>
                )}
                <input type="submit" value={`Create ${locationDef.label}`} data-test="submit" />
            </form>
        );
    }
}

export default LocationFormComponent;
