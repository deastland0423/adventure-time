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
        let _fields = this.props.entityDef.fields.filter(field => field.table_display)
        if(this.props.includeOps) {
            _fields.push({
                id: '__OPERATIONS',
                label: 'Operations',
                table_display: true
            });
        }
        return _fields;
    }

    doDelete(record_id) {
        let deleteOneUrl = `${AppConfig.backend_host}${this.props.entityDef.endpoints.deleteOne}/${record_id}`;
        axios
            .delete(deleteOneUrl)
            .then( response => {
                console.log("record successfully deleted")
                this.refreshTableData();
              })
            .catch( error => {
                //this.setState( { error_message: error.response.data, success_message: '' } );
                console.log("error deleted record:",error)
            })
        ;
    }

    componentDidMount() {
        this.refreshTableData();
    }

    refreshTableData() {
        let getAllUrl = `${AppConfig.backend_host}${this.props.entityDef.endpoints.getMultipleByQuery}`;
        axios
            .get(getAllUrl)
            .then( response => {
                let tableData = response.data.map(row => {
                    row.id = row[this.props.entityDef.id_field];
                    row.__OPERATIONS = (
                        <button onClick={() => this.doDelete(row.id)}>delete</button>
                    )
                    return row
                })
                this.setState( {
                    records: tableData
                })
            })
    }

    render() {
        return(
            <div>
                <BasicForm entityDef={this.props.entityDef} onComplete={() => this.refreshTableData()}/>
                <Table
                    headers={this.tableFields()}
                    getData={() => this.state.records}
                />
            </div>
        );
    }
}

export default EntityBaseComponent;