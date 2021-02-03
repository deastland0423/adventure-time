import React, { Component } from 'react';
import axios from 'axios';

class UsersComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: []
        };
    }

    componentDidMount() {
        let usersUrl = 'https://xlxp3abvkg.execute-api.us-east-1.amazonaws.com/dev/users';
        axios
            .get(usersUrl)
            .then( response => {
                this.setState( {
                    users: response.data
                })
            })
        // Axios request here.
    }

    render() {
        return(
            <ul>
                {this.state.users.map(item => <li key={item.user_id}>{item.email_address}</li>)}
            </ul>
            // Your jsx here
        );
    }
}

export default UsersComponent;