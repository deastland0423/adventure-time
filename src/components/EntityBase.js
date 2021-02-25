import React, { Component } from 'react';
import axios from 'axios';
import AppConfig from '../config';
import Table from './Table';
import BasicForm from './BasicForm';

class EntityBaseComponent extends Component {
    /**
     * Must specify entityDef in props
     */
    constructor(props) {
        super(props);
        this.state = {
            records: []
        };
    }

    tableFields() {
        return this.props.entityDef.fields.filter(field => field.table_display);
    }

    componentDidMount() {
        let getAllUrl = `${AppConfig.backend_host}${this.props.entityDef.endpoints.getMultipleByQuery}`;
        axios
            .get(getAllUrl)
            .then( response => {
                this.setState( {
                    records: response.data.map(row => {row.id = row[this.props.entityDef.id_field]; return row})
                })
            })
    }

    render() {
        return(
            <div>
                <BasicForm entityDef={this.props.entityDef} onComplete={() => this.componentDidMount()}/>
                <Table
                    headers={this.tableFields()}
                    getData={() => this.state.records}
                />
            </div>
        );
    }
}

export default EntityBaseComponent;