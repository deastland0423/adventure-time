import React, { Component } from 'react';
import axios from 'axios';
import AppConfig from '../config';
import Table from './Table';

class UsersComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: []
        };
    }

    componentDidMount() {
        let usersUrl = `${AppConfig.backend_host}/users`;
        axios
            .get(usersUrl)
            .then( response => {
                this.setState( {
                    users: response.data.map(row => {row.id = row.user_id; return row})
                })
            })
    }

    render() {
        const headers=[
            {
                id: 'user_id',
                label: 'User ID'
            },
            {
                id: 'email_address',
                label: 'Email'
            }
        ];
        return(
            <Table
                headers={headers}
                getData={() => this.state.users}
            />
        );
    }
}

export default UsersComponent;