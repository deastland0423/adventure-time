import React, { Component } from 'react';
import axios from 'axios';
import AppConfig from '../config';
import Table from './Table';

class RolesComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roles: []
        };
    }

    componentDidMount() {
        let rolesUrl = `${AppConfig.backend_host}/roles`;
        axios
            .get(rolesUrl)
            .then( response => {
                this.setState( {
                    roles: response.data.map(row => {row.id = row.role_id; return row})
                })
            })
    }

    render() {
        const headers=[
            {
                id: 'role_id',
                label: 'Role ID'
            },
            {
                id: 'role_name',
                label: 'Role Type'
            }
        ];
        return(
            <Table
                headers={headers}
                getData={() => this.state.roles}
            />
        );
    }
}

export default RolesComponent;