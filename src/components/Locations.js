import React, { Component } from 'react';
import axios from 'axios';
import AppConfig from '../config';

class LocationsComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            locations: []
        };
    }

    componentDidMount() {
        let locationsUrl = `${AppConfig.backend_host}/locations`;
        axios
            .get(locationsUrl)
            .then( response => {
                this.setState( {
                    locations: response.data
                })
            })
    }

    render() {
        return(
            <ul>
                {this.state.locations.map(item => <li key={item.location_id}>{item.name}</li>)}
            </ul>
        );
    }
}

export default LocationsComponent;