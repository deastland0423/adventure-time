import React, { Component } from 'react';
import axios from 'axios';
import AppConfig from '../config';

class UserFormComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
          email_address: '',
          password: '',
          success_message: '',
          error_message: ''
        };
    }


    handleSubmit = async (event) => {
        event.preventDefault();
          let usersUrl = `${AppConfig.backend_host}/users`;
          axios
              .post(usersUrl, this.state)
              .then( response => {
                this.setState( { success_message: response.data, error_message: '' } );
              })
              .catch( error => {
                this.setState( { error_message: error.response.data, success_message: '' } );
              })
    };


    render() {
        return(
          <div className="UserForm">
                <form onSubmit={this.handleSubmit}>
                    <div className='message error'>{this.state.error_message}</div>
                    <div className='message success'>{this.state.success_message}</div>
                    <label>User Email</label>
                    <input type="email" name="email_address" defaultValue={this.state.email_address}
                      onChange={event => this.setState({ email_address: event.target.value })}
                    /><br/>
                    <label>Password</label>
                    <input type="password" name="password" defaultValue={this.state.password}
                      onChange={event => this.setState({ password: event.target.value })}
                    />
                    <input type="submit" value="Create User" data-test="submit" />
                </form>
            </div>
        );
    }
}

export default UserFormComponent;