import React, { Component } from 'react';
import axios from 'axios';
import AppConfig from '../config';
import Table from './Table';

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
                    locations: response.data.map(row => {row.id = row.location_id; return row})
                })
            })
    }

    render() {
        const headers=[
            {
                id: 'location_id',
                label: 'ID'
            },
            {
                id: 'name',
                label: 'Name'
            }
        ];
        return(
            <Table
                headers={headers}
                getData={() => this.state.locations}
            />
        );
    }
}

export default LocationsComponent;