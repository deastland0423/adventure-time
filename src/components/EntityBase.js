import React, { Component, createRef } from 'react';
import axios from 'axios';
import AppConfig from '../config';
import Table from './Table';
import BasicForm from './BasicForm';
import { UserContext, curUserCan } from "../contexts/UserContext";
const { safeGetProp } = require('../utils/data_access');


class EntityBaseComponent extends Component {
  static contextType = UserContext;
    /**
     * Must specify entityDef in props
     */
    constructor(props) {
        super(props);
        this.formRef = createRef(null);
        this.formWrapperRef = createRef(null);
        this.createButtonRef = createRef(null);
        this.state = {
            showForm: false,
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

    tableData() {
        let tableData = this.state.records.map(row => {
            let tableRow = {...row};
            this.props.entityDef.fields.forEach(field => {
                // If entityDef.field's table_display is a string, assume it's the name of another field in the data and show the value of that field instead.
                if (field.table_display && typeof(field.table_display) === 'string' && field.table_display in row) {
                    const newValue = row[field.table_display]
                    tableRow[field.id] = newValue;
                }
                // Change Reserved 0/1 values to NO/YES
                if (field.html_input_type === 'checkbox') {
                    tableRow[field.id] === 1 ? tableRow[field.id] = 'YES' : tableRow[field.id] = 'NO';
                }
                // Join multi-value fields
                if (Array.isArray (tableRow[field.id]) ) {
                    tableRow[field.id] = tableRow[field.id].join(', ');
                }
            });
            return tableRow;
        })
        return tableData;
    }

    showForm() {
        this.formWrapperRef.current.classList.remove('hidden');
    }

    hideForm() {
        this.formWrapperRef.current.classList.add('hidden');
    }

    showCreate = () => {
        this.formRef.current.clearData();
        this.showForm()
        if (this.createButtonRef.current) {
            this.createButtonRef.current.classList.add('hidden');
        }
    }

    hideCreate = () => {
        this.hideForm()
        if (this.createButtonRef.current) {
            this.createButtonRef.current.classList.remove('hidden');
        }
    }

    getRecord(record_id) {
        // check loaded records first
        const record = this.state.records.find(r => r[this.props.entityDef.id_field] === record_id)
        if (record) {
            return record;
        }
        // record not found in current dataset/page, fall back to API lookup
        alert("getRecord: fallback API lookup is UNIMPLEMENTED");
    }

    showEdit(record_id) {
        // get data for record to be edited
        const recordData = this.getRecord(record_id);
        this.formRef.current.loadData(recordData);
        this.showForm()
        if (this.createButtonRef.current) {
          this.createButtonRef.current.classList.remove('hidden');
        }
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
                console.log("error deleting record",error.response.data)
                alert("Error deleting record: " + error.response.data)
            })
        ;
    }

    componentDidMount() {
        this.refreshTableData();
    }

    finishForm() {
        this.hideForm();
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
                        <div>
                            {curUserCan(safeGetProp(this, ['context', 'auth']), 'DELETE', this.props.entityDef.endpoints.deleteOne+'/'+row.id) ?
                              <button onClick={() => this.doDelete(row.id)}>delete</button>
                              : null
                            }
                            {curUserCan(safeGetProp(this, ['context', 'auth']), 'PUT', this.props.entityDef.endpoints.update+'/'+row.id) ?
                              <button onClick={() => this.showEdit(row.id)}>edit</button>
                              : null
                            }
                        </div>
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
                <div ref={this.formWrapperRef} className={this.state.showForm ? null : 'hidden'}>
                    <BasicForm
                        entityDef={this.props.entityDef}
                        onComplete={() => this.finishForm()}
                        ref={this.formRef}
                        onCancel={this.hideCreate}
                    />
                </div>
                {curUserCan(safeGetProp(this, ['context', 'auth']), 'POST', this.props.entityDef.endpoints.create) ?
                    <button ref={this.createButtonRef} onClick={this.showCreate}>New {this.props.entityDef.label}</button>
                  : null
                }
                <Table
                    headers={this.tableFields()}
                    getData={() => this.tableData()}
                />
            </div>
        );
    }
}

export default EntityBaseComponent;