import React, { Component } from 'react';

class Table extends Component {
    constructor(props) {
        super(props);
        this.state = {
          headers: props.headers,
          getData: props.getData
        };
    }

    render() {
        return(
          <table className="data-table centered">
            <thead>
              <tr>
                {this.state.headers.map(column => <th key={column.id}>{column.label}</th>)}
              </tr>
            </thead>
            <tbody>
                {this.state.getData().map(row =>
                  <tr key={row.id}>
                    {this.state.headers.map(column => <td key={row.id+'_'+column.id}>{row[column.id]}</td>)}
                  </tr>
                )}
            </tbody>
          </table>
        );
    }
}

export default Table;
