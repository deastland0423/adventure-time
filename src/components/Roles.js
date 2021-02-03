import React, { Component } from 'react';
import axios from 'axios';

class RolesComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roles: []
        };
    }

    componentDidMount() {
        let rolesUrl = 'https://xlxp3abvkg.execute-api.us-east-1.amazonaws.com/dev/roles';
        axios
            .get(rolesUrl)
            .then( response => {
                this.setState( {
                    roles: response.data
                })
            })
        // Axios request here.
    }

    render() {
        return(
            <ul>
                {this.state.roles.map(item => <li key={item.role_id}>{item.role_type}</li>)}
            </ul>
            // Your jsx here
        );
    }
}

export default RolesComponent;