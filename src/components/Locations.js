import React, { Component } from 'react';
import axios from 'axios';
import AppConfig from '../config';
import Table from './Table';
import locationDef from './locationDef';
import LocationForm from './LocationForm';

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
                    locations: response.data.map(row => {row.id = row[locationDef.id_field]; return row})
                })
            })
    }

    render() {
        return(
            <div>
                <LocationForm onComplete={() => this.componentDidMount()}/>
                <Table
                    headers={locationDef.fields}
                    getData={() => this.state.locations}
                />
            </div>
        );
    }
}

export default LocationsComponent;