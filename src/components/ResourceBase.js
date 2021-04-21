import React, { Component, createRef } from 'react';
import axios from 'axios';
import AppConfig from '../config';
import Table from './Table';
import BasicForm from './BasicForm';
import { UserContext, curUserCan } from "../contexts/UserContext";
const { safeGetProp } = require('../utils/data_access');

class ResourceBaseComponent extends Component {
  static contextType = UserContext;
  /**
   * Must specify resourceDef in props
   */
  constructor(props) {
    super(props);
    this.state = {
      showCreateButton: true,
      showForm: false,
      formData: null,
      records: []
    };
  }

  tableFields() {
    let _fields = this.props.resourceDef.fields.filter(field => field.table_display)
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
      this.props.resourceDef.fields.forEach(field => {
        // If resourceDef.field's table_display is a string, assume it's the name of another field in the data and show the value of that field instead.
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

  showCreate = () => {
    this.setState({
      formData: null,
      showForm: true,
      showCreateButton: false
    });
  }

  hideForm = () => {
    this.setState({
      showForm: false,
      showCreateButton: true
    });
  }

  getRecord(record_id) {
    // check loaded records first
    const record = this.state.records.find(r => r[this.props.resourceDef.id_field] === record_id)
    if (record) {
      return record;
    }
    // record not found in current dataset/page, fall back to API lookup
    alert("getRecord: fallback API lookup is UNIMPLEMENTED");
  }

  showEdit(record_id) {
    // get data for record to be edited
    this.setState({
      formData: this.getRecord(record_id),
      showForm: true,
      showCreateButton: true
    });
  }

  doDelete(record_id) {
    if(!window.confirm(`Delete ${this.props.resourceDef.resource_type} #${record_id}?`)) return;
    let deleteOneUrl = `${AppConfig.backend_host}${this.props.resourceDef.endpoints.deleteOne}/${record_id}`;
    axios
    .delete(deleteOneUrl)
    .then( response => {
        console.log("record successfully deleted")
        this.refreshTableData();
      })
    .catch( error => {
        console.log("error deleting record",error.response.data)
        alert("Error deleting record: " + error.response.data)
    });
  }

  componentDidMount() {
    this.refreshTableData();
  }

  finishForm() {
    this.setState({showForm:false});
    this.refreshTableData();
  }

  refreshTableData() {
    let getAllUrl = `${AppConfig.backend_host}${this.props.resourceDef.endpoints.getMultipleByQuery}`;
    axios
    .get(getAllUrl)
    .then( response => {
      let tableData = response.data.map(row => {
        row.id = row[this.props.resourceDef.id_field];
        row.__OPERATIONS = (
          <div>
            {curUserCan(safeGetProp(this, ['context', 'auth']), 'DELETE', this.props.resourceDef.endpoints.deleteOne+'/'+row.id) ?
              <button onClick={() => this.doDelete(row.id)}>delete</button>
              : null
            }
            {curUserCan(safeGetProp(this, ['context', 'auth']), 'PUT', this.props.resourceDef.endpoints.update+'/'+row.id) ?
              <button onClick={() => this.showEdit(row.id)}>edit</button>
              : null
            }
          </div>
        )
        return row;
      });
      this.setState({
        records: tableData
      });
    });
  }

  render() {
    return(
      <div>
        {this.state.showForm ?
          <BasicForm
            formData={this.state.formData}
            resourceDef={this.props.resourceDef}
            onComplete={() => this.finishForm()}
            onCancel={this.hideForm}
          />
        : null }
        {this.state.showCreateButton && curUserCan(safeGetProp(this, ['context', 'auth']), 'POST', this.props.resourceDef.endpoints.create) ?
          <button onClick={this.showCreate}>New {this.props.resourceDef.label}</button>
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

export default ResourceBaseComponent;
