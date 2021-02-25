import React, { Component } from 'react';
import axios from 'axios';
import AppConfig from '../config';
import Table from './Table';
import BasicForm from './BasicForm';
import userDef from './userDef';

class UsersComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            records: []
        };
    }

    tableFields() {
        return userDef.fields.filter(field => field.table_display);
    }

    componentDidMount() {
        let getAllUrl = `${AppConfig.backend_host}${userDef.endpoints.getMultipleByQuery}`;
        axios
            .get(getAllUrl)
            .then( response => {
                this.setState( {
                    records: response.data.map(row => {row.id = row[userDef.id_field]; return row})
                })
            })
    }

    render() {
        return(
            <div>
                <BasicForm entityDef={userDef} onComplete={() => this.componentDidMount()}/>
                <Table
                    headers={this.tableFields()}
                    getData={() => this.state.records}
                />
            </div>
        );
    }
}

export default UsersComponent;