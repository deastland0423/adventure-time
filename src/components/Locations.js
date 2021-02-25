import React, { Component } from 'react';
import axios from 'axios';
import AppConfig from '../config';
import Table from './Table';
import BasicForm from './BasicForm';
import locationDef from './locationDef';

class LocationsComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            records: []
        };
    }

    componentDidMount() {
        let getAllUrl = `${AppConfig.backend_host}${locationDef.endpoints.getMultipleByQuery}`;
        axios
            .get(getAllUrl)
            .then( response => {
                this.setState( {
                    records: response.data.map(row => {row.id = row[locationDef.id_field]; return row})
                })
            })
    }

    render() {
        return(
            <div>
                <BasicForm entityDef={locationDef} onComplete={() => this.componentDidMount()}/>
                <Table
                    headers={locationDef.fields}
                    getData={() => this.state.records}
                />
            </div>
        );
    }
}

export default LocationsComponent;